export type GeoLocation = "US" | "EU" | "UK" | "CA" | "IN" | "GLOBAL";

export interface RateLimitPolicy {
    requestsPerMinute: number;
    burstSize: number;
    cooldownMs: number;
}

export interface ProxyEndpoint {
    provider: "anyIP" | "direct" | "custom";
    region: GeoLocation;
    url?: string;
}

export interface SourceCollectionPolicy {
    sourceName: string;
    rateLimit: RateLimitPolicy;
    proxy: ProxyEndpoint;
}

export interface CollectionAttempt {
    sourceName: string;
    url: string;
    statusCode?: number;
    bodyPreview?: string;
    proxy?: ProxyEndpoint;
}

export interface BlockSignal {
    blocked: boolean;
    reason?: "rate_limited" | "forbidden" | "captcha" | "empty_response";
    retryAfterMs?: number;
}
