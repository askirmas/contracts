export type AllowedObject<K extends string = string> = Record<K,
  null
  |string|number
  |(string|number)[]
  |Record<string, string|number>
>

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
function stringify(
  uri: string,
  data: AllowedObject
) {
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
      , value_ = data[key]

      if (
        value_ === undefined
        || value_ === null
      ) {
        keys[i] = value_
        continue
      }

      const substrLast = actionParsed?.[3]
      , value = substrLast
      ? (value_ as string).substring(0,
        //@ts-expect-error
        substrLast
      )
      : value_

      if (!withKeys) {
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

