import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { regions } from "../data/seed";
import type { Region } from "../types/domain";
import { useLiveSignals } from "./useLiveSignals";

const alertResponse = (id: string, event: string) =>
  new Response(
    JSON.stringify({
      features: [
        {
          id,
          properties: {
            event,
            headline: `${event} headline`,
            description: `${event} description`,
            severity: "Severe",
            certainty: "Likely",
            sent: "2026-07-16T00:00:00.000Z"
          }
        }
      ]
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );

const deferred = <T,>() => {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((next) => {
    resolve = next;
  });
  return { promise, resolve };
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("useLiveSignals", () => {
  it("clears live alerts when the selected region is unsupported", async () => {
    const usRegion = regions[0]!;
    const unsupportedRegion = regions[1]!;
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(alertResponse("first", "Flood Warning")));
    const { result } = renderHook(() => useLiveSignals());

    await act(async () => {
      await result.current.refresh(usRegion);
    });
    expect(result.current.signals).toHaveLength(1);

    await act(async () => {
      await result.current.refresh(unsupportedRegion);
    });
    expect(result.current.signals).toEqual([]);
    expect(result.current.status).toBe("unsupported");
  });

  it("ignores a slower response from an earlier region refresh", async () => {
    const firstRegion = regions[0]!;
    const secondRegion: Region = { ...firstRegion, id: "us-second", name: "Second US region" };
    const firstResponse = deferred<Response>();
    const fetchMock = vi
      .fn()
      .mockImplementationOnce(() => firstResponse.promise)
      .mockResolvedValueOnce(alertResponse("second", "Heat Warning"));
    vi.stubGlobal("fetch", fetchMock);
    const { result } = renderHook(() => useLiveSignals());
    let firstRefresh!: Promise<void>;

    act(() => {
      firstRefresh = result.current.refresh(firstRegion);
    });
    await act(async () => {
      await result.current.refresh(secondRegion);
    });
    expect(result.current.signals[0]?.regionId).toBe(secondRegion.id);

    await act(async () => {
      firstResponse.resolve(alertResponse("first", "Flood Warning"));
      await firstRefresh;
    });
    expect(result.current.signals[0]?.regionId).toBe(secondRegion.id);
    expect(result.current.message).toContain("1 NWS alert");
  });
});
