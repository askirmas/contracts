import type { Payload, value } from "./types"
import { configs, expParser } from "./consts"
import { encoding } from "./encodes"
import { parseAction } from "./utils"

const {isArray: $isArray} = Array

export {
  stringify,
}

/** @see https://tools.ietf.org/html/rfc6570 */
function stringify<UriTemplate extends string>(uriTemplate: UriTemplate, data: Payload<UriTemplate>): string
function stringify(uriTemplate: string, data: Payload<string>): string {
  return uriTemplate.replace(expParser, (_, schemaKey: keyof typeof configs, exp: string) => {
    const varSpecs: value[] = exp.split(",")
    , {length} = varSpecs
    , schema = configs[schemaKey]
    , {
      first = "",
      sep = ",",
      named = false,
      foremp =false,
      encode = false,
      del = "="
    } = schema

    for (let i = length; i--;) {
      const action = parseAction(varSpecs[i] as string)
      , { key } = action
      , value_ = data[key as keyof typeof data]

      if (
        value_ === undefined
        || value_ === null
      ) {
        varSpecs[i] = undefined
        continue
      }

      const {
        last,
        explode,
      } = action

      let value: value = undefined

      switch (typeof value_) {
        case "number": 
          value = value_
          break
        case "string":
          value = encoding(
            encode,
            last === undefined ? value_
            : value_.substring(0, last)
          )
          break
        case "object":
          if ($isArray(value_))
            value = encoding(encode, value_)
            .join(
              !explode ? ","
              : `${sep}${named ? `${key}${del}`: ""}`
            )
          else {
            const entries: string[] = []
            , kvDel = explode ? del : ","
  
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
              varSpecs[i] = value
              continue
            }
          }
      }

      varSpecs[i] = !named
      ? value
      : `${key}${
        value !== "" || foremp
        ? del
        : ""
      }${value}`
    }

    const filtered = varSpecs.filter(v => v !== undefined && v !== null)

    return `${
      filtered.length !== 0 ? first : ""
    }${
      filtered.join(sep)
    }`
  })
}
