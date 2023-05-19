import { sdk } from '../../sdk'
import { manifest as filebrowserManifest } from 'filebrowser/startos/manifest'
import { manifest as nextcloudManifest } from 'nextcloud/startos/manifest'

export const dependencyMounts = sdk
  .setupDependencyMounts()
  .addPath({
    name: 'dataDir',
    manifest: filebrowserManifest,
    volume: 'main',
    path: '/data',
    readonly: true,
  })
  .addPath({
    name: 'filesDir',
    manifest: nextcloudManifest,
    volume: 'main',
    path: '/data/admin/files',
    readonly: true,
  })
  .build()
