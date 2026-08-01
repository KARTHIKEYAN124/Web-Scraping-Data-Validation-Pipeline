import { BlockSignal, CollectionAttempt } from "../types";

const captchaPatterns = ["captcha", "verify you are human", "access denied"];

export const detectBlockSignal = (attempt: CollectionAttempt): BlockSignal => {
    if (attempt.statusCode === 429) {
        return {
            blocked: true,
            reason: "rate_limited",
            retryAfterMs: 60_000,
        };
    }

    if (attempt.statusCode === 403) {
        return {
            blocked: true,
            reason: "forbidden",
            retryAfterMs: 90_000,
        };
    }

    const bodyPreview = attempt.bodyPreview?.trim().toLowerCase();
    if (bodyPreview !== undefined && bodyPreview.length === 0) {
        return {
            blocked: true,
            reason: "empty_response",
            retryAfterMs: 30_000,
        };
    }

    if (bodyPreview && captchaPatterns.some((pattern) => bodyPreview.includes(pattern))) {
        return {
            blocked: true,
            reason: "captcha",
            retryAfterMs: 120_000,
        };
    }

    return { blocked: false };
};
