import axios from "axios";
import { API_URL } from "@config/env";

let wakePromise: Promise<void> | null = null;
let isReady = false;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Waits for the API /health endpoint to become responsive.
 * Uses a shared promise so concurrent callers wait on the same probe.
 * Implements exponential backoff with jitter.
 *
 * @param maxWaitMs total time to wait before rejecting (default 120s)
 */
export function waitForReady(maxWaitMs = 120_000): Promise<void> {
  if (isReady) return Promise.resolve();
  if (wakePromise) return wakePromise;

  wakePromise = (async () => {
    const start = Date.now();

    // Backoff params
    let delay = 3000; // initial delay between probes (ms)
    const maxDelay = 30_000; // max delay between probes (ms)
    const timeoutPerProbe = 5000; // axios probe timeout

    // Initial short wait to give Azure some time to start
    await sleep(3000);

    while (Date.now() - start < maxWaitMs) {
      try {
        await axios.request({
          method: "get",
          url: "/health",
          baseURL: API_URL,
          timeout: timeoutPerProbe,
        });

        isReady = true;
        wakePromise = null;
        return;
      } catch (e) {
        // compute jittered delay: delay + random(0..0.5*delay)
        const jitter = Math.random() * delay * 0.5;
        const waitMs = Math.min(maxDelay, Math.round(delay + jitter));

        if (Date.now() - start + waitMs >= maxWaitMs) break;

        await sleep(waitMs);

        // exponential backoff
        delay = Math.min(maxDelay, delay * 2);
      }
    }

    // Timed out
    wakePromise = null;
    throw new Error("Health check timed out");
  })();

  return wakePromise;
}

export function resetHealth() {
  isReady = false;
  wakePromise = null;
}

export function getIsReady() {
  return isReady;
}
