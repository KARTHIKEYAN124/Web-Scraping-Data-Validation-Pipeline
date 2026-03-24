import { scrapeProducts } from "./scraper";
import { validateProduct } from "./validator";
import { createJiraTicket } from "./jira";

async function run(){
    console.log("Scraping website.....\n");

    const products = await scrapeProducts();
    for (const product of products ){
        const errors=validateProduct(product);
        if (errors.length>0){
            const summary = `Invalid product: ${product.title}`;
            const description = `Errors:\n${errors.join("\n")}`;

            createJiraTicket(summary,description);

        }else {
            console.log(`Valid Product: ${product.title}`);
        }
    }
}
run();