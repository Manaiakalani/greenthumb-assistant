import { describe, it, expect } from "vitest";
import { safeGetItem, safeGetRaw, safeSetItem, safeRemoveItem } from "@/lib/safeStorage";

describe("safeStorage", () => {
  it("safeSetItem + safeGetItem round-trips JSON", () => {
    safeSetItem("test-key", { a: 1, b: "hello" });
    expect(safeGetItem("test-key", null)).toEqual({ a: 1, b: "hello" });
  });

  it("safeGetItem returns fallback for missing key", () => {
    expect(safeGetItem("nonexistent", "default")).toBe("default");
  });

  it("safeGetRaw returns null for missing key", () => {
    expect(safeGetRaw("nonexistent")).toBeNull();
  });

  it("safeSetItem stores string values directly", () => {
    safeSetItem("str-key", "plain string");
    expect(safeGetRaw("str-key")).toBe("plain string");
  });

  it("safeRemoveItem removes a key", () => {
    safeSetItem("remove-me", "value");
    expect(safeGetRaw("remove-me")).not.toBeNull();
    safeRemoveItem("remove-me");
    expect(safeGetRaw("remove-me")).toBeNull();
  });

  it("safeGetItem returns fallback for corrupted JSON", () => {
    localStorage.setItem("corrupt", "{bad json");
    expect(safeGetItem("corrupt", [])).toEqual([]);
  });

  it("safeGetItem handles arrays", () => {
    safeSetItem("arr", [1, 2, 3]);
    expect(safeGetItem<number[]>("arr", [])).toEqual([1, 2, 3]);
  });
});
