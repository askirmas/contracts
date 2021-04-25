import { configs } from "./consts";
import { errors, groupBased, JsonSchema } from "./specs2reg";

describe(groupBased.name, () => {
  const schema: JsonSchema = {
    "properties": {
      "query": {"type": "string"},
      "number": {"type": "integer"},
      //@ts-expect-error //TODO
      "list": {"type": "array"}
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
        "query"                    : errors.NotMatch,
        "number="                  : errors.NotMatch,
      },
      ";": {
        "query=mycelium;number=100": {"query": "mycelium", "number": 100},
        "query="                   : {"query": ""}, // TODO Consider errors.NotMatch
        "query"                    : {"query": ""},
      },
      "#": {
        "mycelium,100": {"query": "mycelium", "number": 100},
        ",100": {"query": "", "number": 100},
        "100": {"query": "100"},
        "100,": {"query": "100"} // TODO Consider errors.NotMatch
      }
    },
    "query,query,query": {
      "?": {
        "query=X&query=X&query=X": {"query": "X"},
        "query=A&query=B"        : errors.NotMatch
      }
    },
    "query:3": {
      "?": {
        "query=123" : {"query": "123"},
        "query=1234": {"query": "1234"} // TODO Consider errors.NotMatch
      }
    },
    "query,query:3": {
      "?": {
        "query=123"           : {"query": "123"},
        "query=123&query=123" : {"query": "123"},
        "query=123&query=1234" : {"query": "1234"}, // TODO errors.NotMatch
        "query=1123&query=123": {"query": "123"}, // TODO errors.NotMatch
        "query=123&query=12"  : {"query": "12"}, // TODO {"query": "123"},
        "query=12&query=123"  : {"query": "123"}, // TODO errors.NotMatch
      }
    },
    // "query:5,query:3": {}
    "list"      : {"&": {"list=r,g,b"            : {"list": "r,g,b"} /* TODO {"list": ["r", "g", "b"]} */ }},
    "list*"     : {"&": {"list=r&list=g&list=b"  : errors.NotMatch /* TODO {"list": ["r", "g", "b"]} */ }},
    "list,list*": {"&": {"list=r,g&list=r&list=g": errors.NotMatch /* TODO {"list": ["r", "g"]} */ }}
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
          
          it(configName, () => expect(processing).toThrow(inputs))
          return
        }

        describe(configName, () => {
          const processor = processing()
          //@ts-expect-error
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
