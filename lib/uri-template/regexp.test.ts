import { integerStats } from "./regexps";

describe(integerStats.name, () => {
  describe("empties", () => {
    it("", () => expect(integerStats(
    )).toStrictEqual({
      min: undefined,
      max: undefined,
      withZero: true
    }))
  
    it("{}", () => expect(integerStats({
    })).toStrictEqual({
      min: undefined,
      max: undefined,
      withZero: true
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
      withZero: false
    }))
  
    it(">=-10.5", () => expect(integerStats({
      minimum: -10.5
    })).toStrictEqual({
      min: -10,
      max: undefined,
      withZero: true
    }))
  
    it("<=10.5", () => expect(integerStats({
      maximum: 10.5
    })).toStrictEqual({
      min: undefined,
      max: 10,
      withZero: true
    }))
  
    it("<=-10.5", () => expect(integerStats({
      maximum: -10.5
    })).toStrictEqual({
      min: undefined,
      max: -11,
      withZero: false
    }))
  })

  describe("range", () => {
    it("[-20,20]", () => expect(integerStats({
      minimum: -20, maximum: 20
    })).toStrictEqual({
      min: -20,
      max: 20,
      withZero: true
    }))

    it("[20,2000]", () => expect(integerStats({
      minimum: 20, maximum: 2000
    })).toStrictEqual({
      min: 20,
      max: 2000,
      withZero: false
    }))

    it("[-2000,-20]", () => expect(integerStats({
      minimum: -2000, maximum: -20
    })).toStrictEqual({
      min: -2000,
      max: -20,
      withZero: false
    }))
  })
})