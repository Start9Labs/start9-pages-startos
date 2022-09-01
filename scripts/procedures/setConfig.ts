import {
  compat,
  types as T
} from "../deps.ts";
export const setConfig: T.ExpectedExports.setConfig = async (effects, input) => {
  // deno-lint-ignore no-explicit-any
  const newConfig = input as any;

  return await compat.setConfig(effects, newConfig, {})
}
