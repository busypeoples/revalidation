export type Rule = Array<Function, string>
export type EnhancedProps = {
  name?: string|Array<string|number>,
  value?: any,
  validateSingle?: boolean,
  instantValidation?: boolean,
  rules?: Array<Rule>,
}

export type Effects = Function
export type StateEffects = [Object, Array<Effects>]
