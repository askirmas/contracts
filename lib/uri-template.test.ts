import {fullParser} from "./uri-template"

describe(fullParser.name, () => {
  describe("1", () => {
    const [parser, expression] = fullParser("http://www..com/foo{?query,number}{#xxx}-")

    it("0", () => expect("http://www..com/foo-".match(parser)?.length).toBe(1 + expression.length))
    it("?", () => expect("http://www..com/foo?abc-".match(parser)?.length).toBe(1 + expression.length))
    it("?", () => expect("http://www..com/foo#def-".match(parser)?.length).toBe(1 + expression.length))
    it("?#", () => expect("http://www..com/foo?abc#abc-".match(parser)?.length).toBe(1 + expression.length))  
  })
})