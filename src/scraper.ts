import axios from "axios";
import * as cheerio from "cheerio";
import { getCollectionPolicy } from "./config/collectionPolicy";
import { FetchStrategy } from "./services/fetchStrategy";
import { SourceCollectionPolicy } from "./types";

export interface Product {
  title: string;
  price: number;
}

const wait = (waitTimeMs: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, waitTimeMs));
};

export async function scrapeProducts(
  collectionPolicy: SourceCollectionPolicy = getCollectionPolicy("default"),
  fetchStrategy = new FetchStrategy()
): Promise<Product[]> {
  const url = "https://books.toscrape.com/";
  const collectionPlan = fetchStrategy.plan(collectionPolicy);

  if (!collectionPlan.allowed) {
    console.log(`Rate limit reached for ${collectionPlan.sourceName}. Waiting ${collectionPlan.waitTimeMs}ms...`);
    await wait(collectionPlan.waitTimeMs);
  }

  let response;

  try {
    response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      const blockSignal = fetchStrategy.recordAttempt(collectionPolicy, {
        sourceName: collectionPolicy.sourceName,
        url,
        statusCode: error.response.status,
        bodyPreview: String(error.response.data).slice(0, 500),
      });

      if (blockSignal.blocked) {
        console.log(`Collection blocked: ${blockSignal.reason}. Cooldown ${blockSignal.retryAfterMs ?? collectionPolicy.rateLimit.cooldownMs}ms.`);
      }
    }

    throw error;
  }

  const blockSignal = fetchStrategy.recordAttempt(collectionPolicy, {
    sourceName: collectionPolicy.sourceName,
    url,
    statusCode: response.status,
    bodyPreview: String(response.data).slice(0, 500),
  });

  if (blockSignal.blocked) {
    console.log(`Collection blocked: ${blockSignal.reason}. Cooldown ${blockSignal.retryAfterMs ?? collectionPolicy.rateLimit.cooldownMs}ms.`);
    return [];
  }

  const $ = cheerio.load(response.data);
  const products: Product[] = [];

  $(".product_pod").each((_, element) => {
    const anchor = $(element).find("h3 a");

    const title =
      anchor.attr("title")?.trim() ||
      anchor.text().trim() ||
      "";

    const priceText = $(element).find(".price_color").text().trim();
    const price = parseFloat(priceText.replace("£", "")) || 0;

    products.push({ title, price });
  });

  return products;
}
