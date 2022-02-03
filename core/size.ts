import { CustomError } from './errors'

export type ListingSize = {
  packageSizeStr?: string
  quantity: number
  value: number
  unit: Units
  averageWeight?: number
}

export enum Units {
  g = 'g',
  ml = 'ml',
  un = 'un',
}

export const POUNDS_PER_KG = 2.2046226218
export const GRAMS_PER_KG = 1000
export const GRAMS_PER_LB = 454
export const ML_PER_L = 1000
export const ML_PER_PINT = 500

export type ComparisonPrice = {
  size: ListingSize
  priceValue: number
}

export const Per100g: ListingSize = {
  quantity: 1,
  unit: Units.g,
  value: 100,
}

export const Per1Kg: ListingSize = {
  quantity: 1,
  unit: Units.g,
  value: 1000,
}

export const Per1lb: ListingSize = {
  quantity: 1,
  unit: Units.g,
  value: 454,
}

export const comparisonSizes = [Per100g, Per1Kg, Per1lb]

export const getSizeVal = (s: ListingSize) => s.averageWeight || s.value

export const getTotalSize = (size: ListingSize) => size.quantity * size.value

export const writeSize = (s: ListingSize) => {
  return `${writeQuantity(s)}${writeValue(s)}${writeUnit(s)}`
}

const writeQuantity = (s: ListingSize) =>
  s.quantity != 1 ? `${s.quantity} x ` : ''

const writeValue = (s: ListingSize) => {
  if (s.unit === Units.un) return getSizeVal(s)
  return getSizeVal(s) >= 1000 ? getSizeVal(s) / 1000 : getSizeVal(s)
}

const writeUnit = (s: ListingSize) => {
  if (getSizeVal(s) < 1000) return s.unit
  if (s.unit === Units.g) return 'Kg'
  if (s.unit === Units.ml) return 'L'
}

export function parseSizeString(str: string): ListingSize {
  const packageSize = str.toLowerCase()

  const number_g = /^((\d*\.)?\d+)\s*g$/
  const number_ml = /^((\d*\.)?\d+)\s*ml$/
  const number_ea = /^((\d*\.)?\d+)\s*(ea|pack|eggs|pieces|bunch|slices|rolls|rl|sheets|cm)$/
  const number_kg = /^((\d*\.)?\d+)\s*kg$/
  const number_l = /^((\d*\.)?\d+)\s*l$/
  const number_lb = /^((\d*\.)?\d+)\s*(lb|lbs|lb bag)$/
  const number_pint = /^((\d*\.)?\d+)\s*pint$/
  const number_x_number_g = /^((\d*\.)?\d+)\s*x\s*((\d*\.)?\d+)\s*g$/
  const number_x_number_ml = /^((\d*\.)?\d+)\s*x\s*((\d*\.)?\d+)\s*ml$/
  const number_x_number_ea = /^((\d*\.)?\d+)\s*x\s*((\d*\.)?\d+)\s*(ea|sheets)$/
  const number_x_number_kg = /^((\d*\.)?\d+)\s*x\s*((\d*\.)?\d+)\s*kg$/
  const number_x_number_l = /^((\d*\.)?\d+)\s*x\s*((\d*\.)?\d+)\s*l$/
  const approx_number_g = /^.*?\(approx. ((\d*\.)?\d+) g\)/

  if (packageSize.match(number_g))
    return makeSimpleSize(number_g, packageSize, Units.g)
  if (packageSize.match(number_ml))
    return makeSimpleSize(number_ml, packageSize, Units.ml)
  if (packageSize.match(number_ea))
    return makeSimpleSize(number_ea, packageSize, Units.un)
  if (packageSize.match(number_kg))
    return makeSimpleSize(number_kg, packageSize, Units.g, GRAMS_PER_KG)
  if (packageSize.match(number_l))
    return makeSimpleSize(number_l, packageSize, Units.ml, ML_PER_L)
  if (packageSize.match(number_lb))
    return makeSimpleSize(number_lb, packageSize, Units.g, GRAMS_PER_LB)
  if (packageSize.match(number_pint))
    return makeSimpleSize(number_pint, packageSize, Units.ml, ML_PER_PINT)
  if (packageSize.match(number_x_number_g))
    return makeQuantitySize(number_x_number_g, packageSize, Units.g)
  if (packageSize.match(number_x_number_ml))
    return makeQuantitySize(number_x_number_ml, packageSize, Units.ml)
  if (packageSize.match(number_x_number_ea))
    return makeQuantitySize(number_x_number_ea, packageSize, Units.un)
  if (packageSize.match(number_x_number_kg))
    return makeQuantitySize(
      number_x_number_kg,
      packageSize,
      Units.g,
      GRAMS_PER_KG
    )
  else if (packageSize.match(number_x_number_l))
    return makeQuantitySize(number_x_number_l, packageSize, Units.ml, ML_PER_L)
  else if (packageSize.match(approx_number_g))
    return makeSize(approx_number_g, packageSize)
  throw new CustomError('Size string cant be parsed: ' + str, { str })
}

function makeSimpleSize(
  regexp: RegExp,
  packageSize: string,
  unit: Units,
  valueMultiplier = 1
): ListingSize {
  return {
    packageSizeStr: packageSize,
    quantity: 1,
    unit,
    value: parseFloat(packageSize.match(regexp)[1]) * valueMultiplier,
  }
}

function makeQuantitySize(
  regexp: RegExp,
  packageSize: string,
  unit: Units,
  valueMultiplier = 1
): ListingSize {
  return {
    packageSizeStr: packageSize,
    quantity: parseFloat(packageSize.match(regexp)[1]),
    unit,
    value: parseFloat(packageSize.match(regexp)[3]) * valueMultiplier,
  }
}

function makeSize(regexp: RegExp, packageSize: string): ListingSize {
  return {
    packageSizeStr: packageSize,
    quantity: 1,
    unit: Units.g,
    value: 1000,
    averageWeight: parseFloat(packageSize.match(regexp)[1]),
  }
}
