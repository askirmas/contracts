export {
  desc,
  tscheck,
  tscompare
}

function desc(title: string, scope: () => any) {return {title, scope}}
function tscheck<T>(check: Record<string, T>) {return check}
function tscompare<T1, T2>(
  sign: [T1] extends [T2] ? (
    [T2] extends [T1] ? "=" : "<"
  ) : (
    [T2] extends [T1] ? ">" : "-"
  )
) {return sign}
