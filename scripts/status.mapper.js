#!/usr/bin/env node

const {definitions} = require("../docs/http/status.schema.json")
, $return = {}

for (const key in definitions) {
  const value = definitions[key].default
  if (typeof value !== "number")
    continue
  $return[key] = value
}

console.log(JSON.stringify($return, null, 2))