import type { AllowedObject, value } from "./uri-template.types"
import { configs } from "./uri-template.config"

const {isArray: $isArray} = Array
, expParser = /\{([+#./;?&]?)([^\}]+)\}/g
, keyWithActionsParser = /^(.+)(\*|:(\d+))$/
, reserved = /[/!;,:]/g

export {
  stringify
}

/** @see https://tools.ietf.org/html/rfc6570 */
function stringify<UriTemplate extends string>(uriTemplate: UriTemplate, data: AllowedObject<UriTemplate>): string
function stringify(uriTemplate: string, data: AllowedObject<string>): string {
  return uriTemplate.replace(expParser, (_, schemaKey: keyof typeof configs, exp: string) => {
    const keys: value[] = exp.split(",")
    , {length} = keys
    , schema = configs[schemaKey] ?? {}
    , {
      first = "",
      sep = ",",
      named = false,
      foremp =false,
      encode = false
    } = schema

    for (let i = length; i--;) {
      const action = keys[i] as string
      , actionParsed = action.match(keyWithActionsParser)
      , key = actionParsed?.[1] ?? action
      , value_ = data[key as keyof typeof data]

      if (
        value_ === undefined
        || value_ === null
      ) {
        keys[i] = undefined
        continue
      }

      const fn = actionParsed?.[2]
      , explode = fn === "*"
      , substrLast = actionParsed?.[3]

      let value: value = undefined

      switch (typeof value_) {
        case "number": 
          value = value_
          break
        case "string":
          value = encoding(
            encode,
            substrLast === undefined ? value_
            : value_.substring(0,
              substrLast as unknown as string extends typeof substrLast ? number : object
          ))
          break
        case "object":
          if ($isArray(value_))
            value = encoding(encode, value_)
            .join(
              !explode ? ","
              : `${sep}${named ? `${key}=`: ""}`
            )
          else {
            const entries: string[] = []
            , kvDel = explode ? "=" : ","
  
            for (const key in value_)
              entries.push(`${
                key
              }${
                kvDel
              }${
                encode ? encoding(encode, value_[key]) : value_[key]
              }`)
  
            value = entries.join(explode ? sep : ",")
              
            if (value === "")
              value = undefined

            if (explode) {
              keys[i] = value
              continue
            }
          }
      }

      keys[i] = !named
      ? value
      : `${key}${
        value !== "" || foremp
        ? "="
        : ""
      }${value}`
    }

    const filtered = keys.filter(v => v !== undefined && v !== null)

    return `${
      filtered.length !== 0 ? first : ""
    }${
      filtered.join(sep)
    }`
  })
}

function encoding(level: boolean, source: value): value
function encoding(level: boolean, source: value[]): value[] 
function encoding(level: boolean, source: value|value[]): value|value[] {
  if (source === undefined || source === null || typeof source === "number")
    return source
  if (typeof source === "string")
    return encodeComponent(level, source)
  
  const {length} = source
  , encoded: value[] = []

  for (let i = length; i--;) {
    const value = source[i]

    encoded[i] = typeof value !== "string"
    ? value
    : encodeComponent(level, value)
  }
    
  return encoded
}

function encodeComponent(level: boolean, input: string) {
  const encoded = encodeURI(input)

  if (!level)
    return encoded

  return encoded.replace(
    reserved,
    escaper
  )
}

function escaper(v: string) {
  return `%${v.charCodeAt(0).toString(16).toUpperCase()}`
}