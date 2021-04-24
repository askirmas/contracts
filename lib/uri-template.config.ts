/**
 * @see https://tools.ietf.org/html/rfc6570#appendix-A
 */
 type Config = {
  /** The string to append to the result first if any of the expression's variables are defined.
   * @default "" */
  first: string
  
  /** The separator to append to the result before any second (or subsequent) defined variable expansion. 
   * @default "," */
  sep: string
  
  /** A boolean for whether or not the expansion includes the variable or key name when no explode modifier is given. */
  named: boolean
  
  /** A string to append to the name if its corresponding value is empty.
   * @default "" */
  // ifemp: string
  /** Do append of `=` to the name if its corresponding value is empty. */
  foremp: boolean

  /** What characters to allow unencoded within the value expansion:
   * - (U) means any character not in the unreserved set will be encoded;
   * - (U+R) means any character not in the union of (unreserved / reserved / pct- encoding) will be encoded;
   * - and, for both cases, each disallowed character is first encoded as its sequence of octets in UTF-8 and then each such octet is encoded as a pct-encoded triplet. */
  // allow: boolean
  /** */
  encode: boolean
}

const configs: Record<"" | "." | "/" | ";" | "?" | "&" | "#" | "+", Partial<Config>>= {
  "":  {                                                          "encode": true},
  "+": {                                                                        },  
  ".": {"first": ".", "sep": ".",                                 "encode": true},
  "/": {"first": "/", "sep": "/",                                 "encode": true},
  ";": {"first": ";", "sep": ";", "named": true ,                 "encode": true},  
  "?": {"first": "?", "sep": "&", "named": true , "foremp": true, "encode": true},
  "&": {"first": "&", "sep": "&", "named": true , "foremp": true, "encode": true},
  "#": {"first": "#",                             "foremp": true,               },
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
  configs as configs,
}
