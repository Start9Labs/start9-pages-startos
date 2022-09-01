import { types as T } from '../deps.ts'

export const health: T.ExpectedExports.health = {
  // deno-lint-ignore require-await
  async 'web-ui'(effects, duration) {
    // Checks that the server is running and reachable via http
    return healthWeb(effects, duration)
  },
}

const healthWeb: T.ExpectedExports.health[''] = async (effects, duration) => {
  await guardDurationAboveMinimum({ duration, minimumTime: 5000 })
  
  return await effects.fetch('http://embassy-pages.embassy:80')
    .then(_ => ok)
    .catch(e => error(e))
}

/** Call to make sure the duration is pass a minimum */
const guardDurationAboveMinimum = (
  input: { duration: number; minimumTime: number },
) =>
  (input.duration <= input.minimumTime)
    ? Promise.reject(errorCode(60, 'Starting'))
    : null


const errorCode = (code: number, error: string) => ({
  'error-code': [code, error] as const,
})
const error = (error: string) => ({ error })
const ok = { result: null }
