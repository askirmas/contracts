import { integerStats, $max } from "./regexps";

describe(integerStats.name, () => {
  describe("empties", () => {
    it("", () => expect(integerStats(
    )).toStrictEqual({
      min: undefined,
      max: undefined,
      withZero: true,
      minNotLeadDigits: 0,
      maxNotLeadDigits: undefined
    }))
  
    it("{}", () => expect(integerStats({
    })).toStrictEqual({
      min: undefined,
      max: undefined,
      withZero: true,
      minNotLeadDigits: 0,
      maxNotLeadDigits: undefined
    }))    
  })

  describe("consts", () => {
    it("min === max", () => expect(integerStats({
      minimum: 9.5, maximum: 10.5
    })).toBe(
      10
    ))  
  })

  describe("errors", () => {
    it("min>max", () => expect(() => integerStats({
      minimum: 9.5, maximum: 9.5
    })).toThrow())  
  })

  describe("single edge", () => {
    it(">=10.5", () => expect(integerStats({
      minimum: 10.5
    })).toStrictEqual({
      min: 11,
      max: undefined,
      withZero: false,
      minNotLeadDigits: 1,
      maxNotLeadDigits: undefined
    }))
  
    it(">=-10.5", () => expect(integerStats({
      minimum: -10.5
    })).toStrictEqual({
      min: -10,
      max: undefined,
      withZero: true,
      minNotLeadDigits: 0,
      maxNotLeadDigits: undefined
    }))
  
    it("<=10.5", () => expect(integerStats({
      maximum: 10.5
    })).toStrictEqual({
      min: undefined,
      max: 10,
      withZero: true,
      minNotLeadDigits: 0,
      maxNotLeadDigits: undefined
    }))
  
    it("<=-10.5", () => expect(integerStats({
      maximum: -10.5
    })).toStrictEqual({
      min: undefined,
      max: -11,
      withZero: false,
      minNotLeadDigits: 1,
      maxNotLeadDigits: undefined
    }))
  })

  describe("range", () => {
    it("[-20,20]", () => expect(integerStats({
      minimum: -20, maximum: 20
    })).toStrictEqual({
      min: -20,
      max: 20,
      withZero: true,
      minNotLeadDigits: 0,
      maxNotLeadDigits: 1
    }))

    it("[20,2000]", () => expect(integerStats({
      minimum: 20, maximum: 2000
    })).toStrictEqual({
      min: 20,
      max: 2000,
      withZero: false,
      minNotLeadDigits: 1,
      maxNotLeadDigits: 3
    }))

    it("[-2000,-20]", () => expect(integerStats({
      minimum: -2000, maximum: -20
    })).toStrictEqual({
      min: -2000,
      max: -20,
      withZero: false,
      minNotLeadDigits: 1,
      maxNotLeadDigits: 3
    }))
  })
})


describe($max.name, () => {
  it("NaN", () => expect($max(NaN, 0)).toBe(0))
  it("undefined,NaN", () => expect($max(NaN, undefined)).toBe(undefined))
  it("NaN,NaN", () => expect($max(NaN, NaN)).toBe(undefined))
})