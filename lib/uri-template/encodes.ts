import { regexEscape, reserved } from "./consts"
import type { value } from "./types"

export {
  encoding,
  escape4Regex
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
    codeChar4Uri
  )
}

// Consider `escape()`
function codeChar4Uri(v: string) {
  return `%${v.charCodeAt(0).toString(16).toUpperCase()}`
}

function escape4Regex(v: string) {
  return v.replace(regexEscape, "\\$&")
}