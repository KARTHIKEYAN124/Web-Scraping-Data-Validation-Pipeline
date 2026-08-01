import { getCollectionPolicy } from "./config/collectionPolicy";
import { FetchStrategy } from "./services/fetchStrategy";
import { createJiraTicket } from "./jira";
import { scrapeProducts } from "./scraper";
import { validateProduct } from "./validator";

async function run() {
    const fetchStrategy = new FetchStrategy();
    const collectionPolicy = getCollectionPolicy("default");
    const collectionPlan = fetchStrategy.plan(collectionPolicy);

    console.log("Scraping website.....\n");
    console.log(
        `Collection route: ${collectionPlan.proxyProvider} ${collectionPlan.region}, ` +
            `configured=${collectionPlan.proxyUrlConfigured}\n`
    );

    const products = await scrapeProducts(collectionPolicy, fetchStrategy);

    for (const product of products) {
        const errors = validateProduct(product);

        if (errors.length > 0) {
            const summary = `Invalid product: ${product.title}`;
            const description = `Errors:\n${errors.join("\n")}`;

            createJiraTicket(summary, description);
        } else {
            console.log(`Valid Product: ${product.title}`);
        }
    }
}

run().catch((error) => {
    console.error("Pipeline failed:", error);
});
