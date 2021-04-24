export type SchemaKeys = "" | "." | "/" | ";" | "?" | "&" | "#" | "+"

/**
 * @see https://tools.ietf.org/html/rfc6570#appendix-A
 */
 export type Config = {
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

export type value = string|number|null|undefined
type structure = value[] | Record<string, value>

export type AllowedObject<UriPattern extends string> = 
string extends UriPattern
? Record<string, value|structure>
: Shape<VarSpecs<UriPattern>>

type Split<E extends string> = E extends `${infer V},${infer Tail}` ? V|Split<Tail> : E

type VarSpecs<K extends string> = K extends `${string}{${infer Expr}}${infer Back}`
? (
  Split<Expr extends `${Exclude<SchemaKeys, "">}${infer E}` ? E : Expr>
) | VarSpecs<Back>
: never

type VarNames<Spec extends string> = Spec extends `${infer V}${"*"|`:${string}`}` ? V : Spec

type Shape<K extends string> = {
  [P in VarNames<K>]?: Extract<Extract<
    value|structure,
    [Extract<K, `${P}:${string}`>] extends [never] ? unknown : string>,
    `${P}*` extends K ? structure : unknown
  >
}
