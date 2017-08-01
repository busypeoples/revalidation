export type Rule = Array<Function, string>
export type EnhancedProps = {
  name?: string|Array<string|number>,
  value?: any,
  validateSingle?: boolean,
  validateOnChange?: boolean,
  rules?: Array<Rule>,
}
