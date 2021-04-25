import type { Payload, structure, value } from "./types"

type IsEqual<T1, T2> = [T1] extends [T2] ? [T2] extends [T1] ? true : false : false

exp<IsEqual<Payload<"{whatever}">, {whatever?: value|structure}>>(true);
exp<IsEqual<Payload<"{string:1}">, {string?: string}>>(true);
exp<IsEqual<Payload<"{structure*}">, {structure?: structure}>>(true);
exp<IsEqual<Payload<"{never*,never:5}">["never"], undefined>>(true);

function exp<T1>(target: T1) {return target}
// function tscheck<T>(checks: Record<string, T>) {return checks}

it("1", () => expect(1).toBe(1))