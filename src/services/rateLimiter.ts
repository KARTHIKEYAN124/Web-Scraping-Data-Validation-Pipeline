import { RateLimitPolicy } from "../types";

interface RateLimitState {
    timestamps: number[];
    cooldownUntil: number;
}

export class SourceRateLimiter {
    private readonly states = new Map<string, RateLimitState>();

    canRequest(sourceName: string, policy: RateLimitPolicy, now = Date.now()): boolean {
        const state = this.getState(sourceName);

        if (state.cooldownUntil > now) {
            return false;
        }

        state.timestamps = this.getRecentTimestamps(state.timestamps, now);

        return state.timestamps.length < policy.requestsPerMinute &&
            state.timestamps.length < policy.burstSize;
    }

    recordRequest(sourceName: string, now = Date.now()): void {
        const state = this.getState(sourceName);
        state.timestamps.push(now);
    }

    recordCooldown(sourceName: string, cooldownMs: number, now = Date.now()): void {
        const state = this.getState(sourceName);
        state.cooldownUntil = Math.max(state.cooldownUntil, now + cooldownMs);
    }

    getWaitTimeMs(sourceName: string, policy: RateLimitPolicy, now = Date.now()): number {
        const state = this.getState(sourceName);

        if (state.cooldownUntil > now) {
            return state.cooldownUntil - now;
        }

        const recent = this.getRecentTimestamps(state.timestamps, now);
        if (recent.length < policy.requestsPerMinute && recent.length < policy.burstSize) {
            return 0;
        }

        const oldestTimestamp = Math.min(...recent);
        return Math.max(0, oldestTimestamp + 60_000 - now);
    }

    private getState(sourceName: string): RateLimitState {
        const existing = this.states.get(sourceName);
        if (existing) {
            return existing;
        }

        const state: RateLimitState = {
            timestamps: [],
            cooldownUntil: 0,
        };
        this.states.set(sourceName, state);
        return state;
    }

    private getRecentTimestamps(timestamps: number[], now: number): number[] {
        return timestamps.filter((timestamp) => now - timestamp < 60_000);
    }
}
