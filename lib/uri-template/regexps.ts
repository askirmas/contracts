type NumberSchema = {
  minimum: number
  maximum: number
  // multipleOf
  // exclusiveMinimum: number
  // exclusiveMaximum: number
}

const {floor: $floor, ceil: $ceil, sign: $sign} = Math

export {
  integerPattern,
  integerStats,
  $max
}

function integerPattern({
  minimum,
  maximum
}: Partial<NumberSchema> = {}) {
  const min = minimum && $ceil(minimum)
  , lenOfMin = notLeadDigits(min)
  , max = maximum && $floor(maximum)
  , lenOfMax = notLeadDigits(max)

  if (min! > max!)
    throw Error(`Min>Max: '${min}' '${max}'`)

  if (min !== undefined && min === max)
    return min

  return `${
    min! > 0 ? ""
    : max! < 0 ? "-"
    : `0|${
      min === 0 ? ""
      : max === 0 ? "-"
      : "-?"
    }`
  }[1-9][0-9]${
    min === undefined && max === undefined ? "*"
    : min! < 0 && max! > 0 ? `{0,${$max(lenOfMin!, lenOfMax!)}}`
    : "*"
  }`
}

function integerStats({
  minimum,
  maximum
}: Partial<NumberSchema> = {}) {
  const min = $ceil(minimum!)
  , max = $floor(maximum!)

  if (min > max)
    throw Error(`${min}>${max}`)

  if (min === max)
    return min
  
  const signOfMin = $sign(min)
  , signOfMax = $sign(max)
  , minusLength = signOfMax === -1 ? 1 : 0
  , withZero = !(signOfMin === 1 || signOfMax === -1 || signOfMin === signOfMax)
  , notLeadMin = notLeadDigits(min)
  , notLeadMax = notLeadDigits(max)

  let minNotLeadDigits = (withZero ? 0
  : signOfMin === 1 ? notLeadMin
  : signOfMax === -1 ? notLeadMax
  // istanbul ignore next - Imposibru
  : 0)!
  , maxNotLeadDigits = isNaN(signOfMin * signOfMax) ? undefined : $max(notLeadMin, notLeadMax)

  let commonStart: string|undefined = undefined
  , predictedStart: string|undefined = undefined

  if (signOfMin === signOfMax && minNotLeadDigits === maxNotLeadDigits) {
    
    const minStr = `${min}`
    , maxStr = `${max}`
    , length = minStr.length

    for (let i = 0; i < length; i++) {
      const minChar = minStr[i]
      , maxChar = maxStr[i]

      if (minChar === maxChar) {
        commonStart = (commonStart ?? "") + minChar
        continue
      }
      
      const commonLengthMinus1 = (commonStart?.length ?? 0) - minusLength - 1
      minNotLeadDigits -= commonLengthMinus1
      maxNotLeadDigits -= commonLengthMinus1

      const bottomChar = signOfMax === 1 ? minChar : maxChar
      , topChar = signOfMax === 1 ? maxChar : minChar

      if (bottomChar !== "0" || topChar !== "9") {
        minNotLeadDigits--
        maxNotLeadDigits--

        predictedStart = `[${bottomChar}${
          //@ts-expect-error
          topChar - bottomChar === 1 ? "" : "-"
        }${topChar}]`
      }
      
      
      break
    }
  }

  return filterUndef({
    min: undefOnNan(min),
    max: undefOnNan(max),
    withZero,
    minNotLeadDigits,
    maxNotLeadDigits,
    commonStart,
    predictedStart
  })
}

function filterUndef<T extends Record<string, unknown>>(source: T): {[K in keyof T]?: Exclude<T[K], undefined>} {
  const $return: Partial<ReturnType<typeof filterUndef>> = {}
  for (const key in source) {
    const value = source[key]
    if (value === undefined)
      continue
    $return[key] = value
  }
  //@ts-expect-error
  return $return 
}

function undefOnNan<T>(x: T) {
  //@ts-expect-error
  return isNaN(x) ? undefined : x
}

function notLeadDigits(integer: undefined|number) {
  return integer && `${integer}`.length - 1 - (integer < 0 ? 1 : 0)
}

function $max(v1: number|undefined, v2: number|undefined) {
  const n1 = undefOnNan(v1)
  , n2 = undefOnNan(v2)

  if (n2 === undefined)
    return n1
  if (n1 === undefined)
    return n2

  return n2 > n1 ? n2 : n1
}