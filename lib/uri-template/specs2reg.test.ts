import { configs } from "./consts";
import { groupBased, JsonSchema } from "./specs2reg";

describe("query,number", () => {
  const expr = "query,number"
  , schema: JsonSchema = {
    "properties": {
      "query": {"type": "string"},
      "number": {"type": "integer"}
    }
  }
  , processor = groupBased(configs["?"], expr, schema)
  , suites = {
      "query=mycelium&number=100": {
        "query": "mycelium",
        "number": 100
      },
      "query=mycelium": {
        "query": "mycelium"
      },
      "number=100": {
        "number": 100
      },
      "": {}
    }
  
  for (const input in suites) {
    it(input, () => expect(
      processor(input)
    ).toStrictEqual(suites[input as keyof typeof suites]))
  }
})
