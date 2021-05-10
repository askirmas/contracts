
import type { configs } from "./consts";
import type { Payload, structure, value } from "./types"

type ConfigKeys = keyof typeof configs

type IsEqual<T1, T2> = [T1] extends [T2] ? [T2] extends [T1] ? true : false : false

exp<IsEqual<Payload<ConfigKeys, "{whatever}">, {whatever?: value|structure}>>(true);
exp<IsEqual<Payload<ConfigKeys, "{string:1}">, {string?: string}>>(true);
exp<IsEqual<Payload<ConfigKeys, "{structure*}">, {structure?: structure}>>(true);
exp<IsEqual<Payload<ConfigKeys, "{never*,never:5}">["never"], undefined>>(true);

function exp<T1>(target: T1) {return target}
// function tscheck<T>(checks: Record<string, T>) {return checks}

it("1", () => expect(1).toBe(1))
