type IfExtends<T1, T2, Then, Else> = [T1] extends [T2]
? keyof T1 extends keyof T2 ? Then : Else
: Else

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
