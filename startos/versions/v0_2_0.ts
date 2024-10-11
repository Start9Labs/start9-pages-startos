import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const v0_2_0 = VersionInfo.of({
  version: '0.2.0:0',
  releaseNotes: 'Revamped for StartOS 0.3.6',
  migrations: {
    up: async ({ effects }) => {
      // remove old start9 dir
      // await rmdir('/root/start9')
      // await effects.setConfigured(false)

      // const yaml = (await yamlFile.read.const(effects))!
      // await sdk.action.requestOwn(effects, config, 'critical', {
      //   input: { kind: 'partial', value: yaml },
      // })
    },
    down: IMPOSSIBLE,
  },
})