const schemas: Record<string, undefined|Partial<
  Record<"lead"|"delimiter", string>
  & Record<"keys", boolean>
>>= {
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
    "keys": true,
    "lead": "?",
    "delimiter": "&"
  },
  "&": {
    "keys": true,
    "lead": "&",
    "delimiter": "&"
  },
  ";": {
    "keys": true,
    "lead": ";",
    "delimiter": ";"
  }  
}

export {
  stringify
}

/** @see https://tools.ietf.org/html/rfc6570 */
function stringify(uri: string, data: Record<string, unknown>) {
  const parser = new RegExp(/\{([+#./?&]?)([^\}]+)\}/g)
  
  return uri.replace(parser, (_, schemaKey, exp: string) => {
    const keys: (string|null|undefined)[] = exp.split(",")
    , {length} = keys
    , schema = schemas[schemaKey]

    for (let i = length; i--;) {
      const key = keys[i] as string
      , value = !(key in data)
      ? key
      : data[key]

      if (
        value === undefined
        || value === null
        || !schema?.keys
      ) {
        //@ts-expect-error
        keys[i] = value
        continue
      }

      keys[i] = `${key}=${value}`
    }
    
    const filtered = keys.filter(v => v !== undefined && v !== null)

    return `${
      filtered.length !== 0 && schema?.lead || ""
    }${
      filtered.join(
        schema?.delimiter ?? ","
      )
    }`
  })
}

