import { SourceCollectionPolicy } from "../types";

export const defaultCollectionPolicies: SourceCollectionPolicy[] = [
    {
        sourceName: "default",
        rateLimit: {
            requestsPerMinute: 30,
            burstSize: 5,
            cooldownMs: 60_000,
        },
        proxy: {
            provider: "direct",
            region: "GLOBAL",
        },
    },
    {
        sourceName: "geo-us",
        rateLimit: {
            requestsPerMinute: 20,
            burstSize: 3,
            cooldownMs: 90_000,
        },
        proxy: {
            provider: "anyIP",
            region: "US",
            url: process.env.ANYIP_US_PROXY_URL,
        },
    },
    {
        sourceName: "geo-eu",
        rateLimit: {
            requestsPerMinute: 20,
            burstSize: 3,
            cooldownMs: 90_000,
        },
        proxy: {
            provider: "anyIP",
            region: "EU",
            url: process.env.ANYIP_EU_PROXY_URL,
        },
    },
];

export const getCollectionPolicy = (
    sourceName: string,
    policies = defaultCollectionPolicies
): SourceCollectionPolicy => {
    return (
        policies.find((policy) => policy.sourceName === sourceName) ??
        policies.find((policy) => policy.sourceName === "default") ??
        defaultCollectionPolicies[0]
    );
};
