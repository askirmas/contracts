// type Part<T> = {[K in keyof T]?: T[K]}
export type AnyObject = {[k: string]: any}
export type EmptyObject = {[k in never]: never}
export type IsSame<T, E> = [T] extends [E] ? ([E] extends [T] ? true : false) : false;

export type GetByTrajectory<S, Traj extends string, Delimiter extends string = "/"> = Traj extends "" ? S
: Traj extends `${infer P}${Delimiter}${infer Next}`
  ? (
    P extends keyof S ? GetByTrajectory<S[P], Next> : never
  )
  : Traj extends keyof S ? S[Traj] : never

export type GetByPath<Delimiter extends string, T, Path extends string> = [Extract<T, AnyObject>] extends [never]
? never
: (
  Path extends `${infer Prop}${Delimiter}${infer NextPath}`
  ? Prop extends keyof T ? GetByPath<Delimiter, T[Prop], NextPath> : never
  : Path extends keyof T ? T[Path] : never
)
