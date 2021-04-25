import { escapeVar } from "./encodes";
import type { Config } from "./types";
import { parseAction } from "./utils";

const errors = {
  "NotMatch": Error("Not match")
}

export type JsonSchema = {
  properties: {
    [property: string]: {
      type: "string"|"integer"|"array"
    }
  }
}

export {
  errors,
  groupBased
}

function groupBased(
  {
    named = false,
    sep = ",",
    foremp = false
  }: Partial<Config>,
  varSpecs: string,
  schema: JsonSchema
) {
  const {properties} = schema
  , tokens: string[] = []
  , specs = varSpecs.split(",")
  , {length} = specs
  , escapes = new Map<string, string>()
  , actioned = new Set<string>()

  for (let i = 0; i< length; i++) {
    const action = specs[i]
    , {
      key,
      last
    } = parseAction(action)
    , {type} = properties[key]
    , escaped = escapeVar(action)
    , captured = actioned.has(escaped) || escapes.has(escaped)

    tokens.push(
      `(${
        named
        ? `${key}=${foremp ? "" : "?"}`
        : ""
      }(${
        captured
        ? `\\k<${escaped}>`
        : `?<${escaped}>${
          type === "integer"
          ? "\\d+"
          : `[^${sep}]${
            last === undefined ? "*" : `{0,${last}}`
          }`
        }`
      })(${sep}|$))?` // ?? vs ?
    )

    if (!captured)
      if (action === escaped)
        actioned.add(escaped)
      else
        escapes.set(escaped, key)
  }

  return (input: string) => processor(
    input,
    schema,
    new RegExp(`^${tokens.join("")}$`),
    escapes.size === 0 ? undefined : escapes
  )
}

function processor(
  input: string,
  {properties}: JsonSchema,
  parser: RegExp,
  escapes: undefined|Map<string, string>,
) {
  const groups = input.match(parser)?.groups
    
  if (groups === undefined)
    throw errors.NotMatch

  const out: Record<string, any> = {}

  for (const groupName in groups) {
    const value = groups[groupName]

    if (value === undefined)
      continue
    
    const key = escapes?.get(groupName) ?? groupName
    , {type} = properties[key]
    
    switch (type) {
      case "integer": 
        out[key] = +value
        break
      case "array":
        out[key] = value.split(",")
        break
      default:
        out[key] = value    
    }
  }

  return out  
}