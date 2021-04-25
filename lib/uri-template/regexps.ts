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

  return `${
    min! > 0 ? ""
    : max! < 0 ? "-"
    : `0|${
      minimum === 0 ? ""
      : maximum === 0 ? "-"
      : "-?"
    }`
  }[1-9][0-9]*`
}

