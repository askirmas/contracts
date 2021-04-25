import { encoding } from "./encodes";

describe(encoding.name, () => {
  it("null", () => expect(encoding(false, null)).toBe(null))
  it("undefined", () => expect(encoding(false, undefined)).toBe(undefined))
  it("[1, '2']", () => expect(encoding(false, [1, "2"])).toStrictEqual([1, "2"]))
})