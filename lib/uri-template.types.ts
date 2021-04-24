export type AllowedObject<K extends string = string> = Record<K,
  null
  |string|number
  |(string|number)[]
  |Record<string, string|number>
>
