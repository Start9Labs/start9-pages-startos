import { VersionGraph } from '@start9labs/start-sdk'
import { v_1_0_0_4 } from './v1.0.0.4'
import { v_1_0_0_5 } from './v1.0.0.5'

export const versionGraph = VersionGraph.of({
  current: v_1_0_0_5,
  other: [v_1_0_0_4],
})
