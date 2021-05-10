import type { Config, Payload, value } from "./types"
import { expParser } from "./consts"
import { encoding } from "./encodes"
import { parseAction } from "./utils"

const {isArray: $isArray} = Array

export {
  stringify,
}

/** @see https://tools.ietf.org/html/rfc6570 */
function stringify<SchemaKeys extends string, UriTemplate extends string>(
  configs: {[S in SchemaKeys]: Config},
  uriTemplate: UriTemplate,
  data: Payload<SchemaKeys, UriTemplate>
): string {
  return uriTemplate.replace(expParser, (_, schemaKey: keyof typeof configs, exp: string) => {
    const varSpecs: value[] = exp.split(",")
    , {length} = varSpecs
    , schema = configs[schemaKey]
    , {
      first,
      sep,
      named,
      foremp,
      encode,
      del,
      valuefirst
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
            , kvDel_ = explode ? del : ","
  
            for (const key in value_) {
              const encoded = encode ? encoding(encode, value_[key]) : value_[key]
              , kvDel = encoded !== "" || foremp
              ? kvDel_
              : ""

              entries.push(
                valuefirst
                ? `${encoded}${kvDel}${key}`
                : `${key}${kvDel}${encoded}`
              )
            }
  
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
      // TODO Should be replaced with next but appears uncovered
      // if (!named)
      //   varSpecs[i] = value
      // else {
      //   const kvDel = value !== "" || foremp
      //   ? del
      //   : ""

      //   varSpecs[i] = valuefirst
      //   ? `${value}${kvDel}${key}`
      //   : `${key}${kvDel}${value}`
      // }  
    }

    const filtered = varSpecs.filter(v => v !== undefined && v !== null)

    return `${
      filtered.length !== 0 ? first : ""
    }${
      filtered.join(sep)
    }`
  })
}
