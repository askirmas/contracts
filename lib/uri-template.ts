const schemas: Record<string, undefined|Partial<{
  "lead": string
  "delimiter": string
  "withKeys": boolean
  "kvOnEmpty": boolean
}>>= {
  "/": {
    "lead": "/",
    "delimiter": "/",
  },
  ".": {
    "lead": ".",
    "delimiter": "."
  },
  "#": {
    "lead": "#"
  },
  "?": {
    "lead": "?",
    "delimiter": "&",
    "withKeys": true,
    "kvOnEmpty": true,
  },
  "&": {
    "lead": "&",
    "delimiter": "&",
    "withKeys": true,
    "kvOnEmpty": true,
  },
  ";": {
    "lead": ";",
    "delimiter": ";",
    "withKeys": true,
    "kvOnEmpty": false,
  }  
}

export {
  stringify
}

/** @see https://tools.ietf.org/html/rfc6570 */
function stringify(uri: string, data: Record<string, unknown>) {
  const expParser = /\{([+#./;?&]?)([^\}]+)\}/g
  , keyWithActionsParser = /^(.+)(\+|:(\d+))$/

  return uri.replace(expParser, (_, schemaKey, exp: string) => {
    const keys: (string|null|undefined)[] = exp.split(",")
    , {length} = keys
    , schema = schemas[schemaKey] ?? {}
    , {
      lead = "",
      delimiter = ",",
      withKeys = false,
      kvOnEmpty = false
    } = schema

    for (let i = length; i--;) {
      const action = keys[i] as string
      , actionParsed = action.match(keyWithActionsParser)
      , key = actionParsed?.[1] ?? action
      , value = data[key]
      
      if (
        value === undefined
        || value === null
        || !withKeys
      ) {
        //@ts-expect-error
        keys[i] = value
        continue
      }

      keys[i] = `${key}${
        !kvOnEmpty && value === "" 
        ? ""
        : `=${value}`
      }`
    }

    const filtered = keys.filter(v => v !== undefined && v !== null)

    return `${
      filtered.length !== 0 ? lead : ""
    }${
      filtered.join(delimiter)
    }`
  })
}

