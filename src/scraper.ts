import axios from "axios";
import * as cheerio from "cheerio";
export interface Product {
  title: string;
  price: number;
}
export async function scrapeProducts(): Promise<Product[]> {
  const url = "https://books.toscrape.com/";

  const response = await axios.get(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9",
    },
  });

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