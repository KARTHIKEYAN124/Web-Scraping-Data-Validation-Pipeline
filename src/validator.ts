import { Product } from "./scraper";
export function validateProduct(product:Product): string[]{
    const errors: string[]=[];
    if (!product.title) errors.push("Missing title");
    if (product.price<=20) errors.push("Price is too low (<20)");
    return errors;
}