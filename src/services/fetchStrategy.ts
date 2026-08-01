import { detectBlockSignal } from "./blockDetector";
import { SourceRateLimiter } from "./rateLimiter";
import { BlockSignal, CollectionAttempt, SourceCollectionPolicy } from "../types";

export interface FetchPlan {
    allowed: boolean;
    sourceName: string;
    proxyProvider: string;
    region: string;
    waitTimeMs: number;
    proxyUrlConfigured: boolean;
}

export class FetchStrategy {
    constructor(private readonly rateLimiter = new SourceRateLimiter()) {}

    plan(policy: SourceCollectionPolicy): FetchPlan {
        const allowed = this.rateLimiter.canRequest(policy.sourceName, policy.rateLimit);

        return {
            allowed,
            sourceName: policy.sourceName,
            proxyProvider: policy.proxy.provider,
            region: policy.proxy.region,
            waitTimeMs: allowed ? 0 : this.rateLimiter.getWaitTimeMs(policy.sourceName, policy.rateLimit),
            proxyUrlConfigured: Boolean(policy.proxy.url),
        };
    }

    recordAttempt(policy: SourceCollectionPolicy, attempt: CollectionAttempt): BlockSignal {
        this.rateLimiter.recordRequest(policy.sourceName);

        const blockSignal = detectBlockSignal({
            ...attempt,
            proxy: attempt.proxy ?? policy.proxy,
        });

        if (blockSignal.blocked) {
            this.rateLimiter.recordCooldown(
                policy.sourceName,
                blockSignal.retryAfterMs ?? policy.rateLimit.cooldownMs
            );
        }

        return blockSignal;
    }
}
