import { ReadonlyKeys } from "../types/ts-swiss.types"

type IfExtends<T1, T2, Then, Else> = [T1] extends [T2]
? keyof T1 extends keyof T2
  ? ReadonlyKeys<T2> extends ReadonlyKeys<T1>
    ? Then
    : Else
  : Else
: Else

// Mongoose uses:
// type IfEquals<T1, T2, Then, Else> =
// (<T>() => T extends T1 ? 1 : 2) extends
// (<T>() => T extends T2 ? 1 : 2) ? Then : Else;

export type CompareSign<T1, T2> = IfExtends<T1, T2, 
  IfExtends<T2, T1, "=", "<">,
  IfExtends<T2, T1, ">", "-">
>

export {
  desc,
  tscheck,
  tscompare
}

function desc(title: string, scope: () => any) {return {title, scope}}
function tscheck<T>(check: Record<string, T>) {return check}
function tscompare<T1, T2>(sign: CompareSign<T1, T2>) {return sign}
