import { escapeVar } from "./encodes";
import type { Config } from "./types";
import { parseAction } from "./utils";

const errors = {
  "NotMatch": Error("Not match")
}

export type JsonSchema = {
  properties: {
    [property: string]: {
      type: "string"|"integer"
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
  {properties}: JsonSchema
) {
  const tokens: string[] = []
  , specs = varSpecs.split(",")
  , {length} = specs
  , escapes = new Map<string, string>()
  , actioned = new Set<string>()

  for (let i = 0; i< length; i++) {
    const action = specs[i]
    , {key} = parseAction(action)
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
          type === "integer" ? "\\d+" : `[^${sep}]*`
        }`
      })(${sep}|$))?` // ?? vs ?
    )

    if (!captured) {
      if (action === escaped)
        actioned.add(escaped)
      else
        escapes.set(escaped, key)
    }
    
  }

  const parser = new RegExp(`^${tokens.join("")}$`)
  , processor = (input: string) => {
    const groups = input.match(parser)?.groups
    
    if (groups === undefined)
      throw errors.NotMatch

    const out: Record<string, any> = {}

    for (const groupName in groups) {
      const value = groups[groupName]

      if (value === undefined)
        continue
      
      const key = escapes.get(groupName) ?? groupName
      , {type} = properties[key]
      
      out[key] = type === "integer" ? +value : value
    }

    return out
  }
  
  return processor
}
