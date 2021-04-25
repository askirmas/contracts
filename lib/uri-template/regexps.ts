type IntegerSchema = {
  minimum: number
  maximum: number
  // multipleOf
  // exclusiveMinimum: number
  // exclusiveMaximum: number
}

const {floor: $floor, ceil: $ceil} = Math

export {
  integerPattern
}

function integerPattern({
  minimum,
  maximum
}: Partial<IntegerSchema> = {}) {
  const min = minimum && $ceil(minimum)
  , max = maximum && $floor(maximum)

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
  }[1-9][0-9]*`
}

