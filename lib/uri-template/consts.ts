import type {SchemaKeys, Config} from "./types"

const regexEscape = new RegExp(`[\\${
  "-[]/{}()*+?.\\^$|"
  .split("")
  .join("\\")
}]`, "g")
, reserved = /[/!;,:]/g
, property = /[a-zA-Z_\$][a-zA-Z_\$0-9]*/
, modifier = /\*|:(\d+)/
, propWithModifier = new RegExp(`${property.source}(${modifier.source})?`)
, expParser = new RegExp(`\\{(.*?)(${
  propWithModifier.source
}(,${propWithModifier.source})*)\\}`, "g")
// TODO replace `.+` with var pattern and without `^$`
, keyWithActionsParser = /^(.+)(\*|:(\d+))$/
// , expSplit = /(?:(\{[+#./;?&]?[^\}]+\}))/
, configs: Record<SchemaKeys, Config>= {
  "":  {"first": "" , "sep": ",", "named": false, "del": "=", "foremp": false, "encode": true },
  "+": {"first": "" , "sep": ",", "named": false, "del": "=", "foremp": false, "encode": false},  
  ".": {"first": ".", "sep": ".", "named": false, "del": "=", "foremp": false, "encode": true },
  "/": {"first": "/", "sep": "/", "named": false, "del": "=", "foremp": false, "encode": true },
  ";": {"first": ";", "sep": ";", "named": true , "del": "=", "foremp": false, "encode": true },  
  "?": {"first": "?", "sep": "&", "named": true , "del": "=", "foremp": true , "encode": true },
  "&": {"first": "&", "sep": "&", "named": true , "del": "=", "foremp": true , "encode": true },
  "#": {"first": "#", "sep": ",", "named": false, "del": "=", "foremp": true , "encode": false},
}

// "":  {"first": "" , "sep": ",", "named": false, "ifemp": "" , "allow": false},
// "+": {"first": "" , "sep": ",", "named": false, "ifemp": "" , "allow": true },
// ".": {"first": ".", "sep": ".", "named": false, "ifemp": "" , "allow": false},
// "/": {"first": "/", "sep": "/", "named": false, "ifemp": "" , "allow": false},
// ";": {"first": ";", "sep": ";", "named": true , "ifemp": "" , "allow": false},
// "?": {"first": "?", "sep": "&", "named": true , "ifemp": "=", "allow": false},
// "&": {"first": "&", "sep": "&", "named": true , "ifemp": "=", "allow": false},
// "#": {"first": "#", "sep": ",", "named": false, "ifemp": "=", "allow": true }

export {
  regexEscape,
  reserved,
  configs,
  expParser,
  keyWithActionsParser
}
