import { configs } from "./consts";
import { errors, groupBased, JsonSchema } from "./specs2reg";

describe(groupBased.name, () => {
  const schema: JsonSchema = {
    "properties": {
      "query": {"type": "string"},
      "number": {"type": "integer"}
    }
  }
  , suites = {
    "query,number": {
      "?": {
        "query=mycelium&number=100": {"query": "mycelium", "number": 100},
        "number=100&query=mycelium": errors.NotMatch,
        "query=mycelium"           : {"query": "mycelium"},
        "number=100"               : {"number": 100},
        ""                         : {},
        "query="                   : {"query": ""},
        "query"                    : errors.NotMatch
      },
      ";": {
        "query=mycelium;number=100": {"query": "mycelium", "number": 100},
        "query="                   : {"query": ""}, // ? errors.NotMatch
        "query"                    : {"query": ""},
      }
    },
    "query,query,query": {
      "?": {
        "query=X&query=X&query=X": {"query": "X"},
        "query=A&query=B"        : errors.NotMatch
      }
    }
  }
  
  for (const _varSpecs in suites) {
    const varSpecs = _varSpecs as keyof typeof suites
    
    describe(varSpecs, () => {
      const suite = suites[varSpecs]

      for (const _configName in suite) {
        const configName = _configName as keyof typeof suite
        , inputs = suite[configName]
        , processing = () => groupBased(configs[configName], varSpecs, schema)

        if (
          Object.getPrototypeOf(inputs).name === "Error" // typeof inputs === "function"
        ) {
          //@ts-expect-error
          it(configName, () => expect(processing).toThrow(inputs))
          return
        }

        describe(configName, () => {
          const processor = processing()
          
          for (const _input in inputs) {
            const input = _input as keyof typeof inputs
            , output = inputs[input]

            //@ts-expect-error
            it(input, output instanceof Error
              ? () => expect(() => processor(input)).toThrow(output)
              : () => expect(processor(input)).toStrictEqual(output)
            )
          }
        })
      }
    })
  }
})
