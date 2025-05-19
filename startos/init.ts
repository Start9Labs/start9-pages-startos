import { sdk } from './sdk'
import { setDependencies } from './dependencies'
import { setInterfaces } from './interfaces'
import { versions } from './versions'
import { actions } from './actions'
import { store } from './file-models/store.json'
import { config } from './actions/config'

// **** PreInstall ****
const preInstall = sdk.setupPreInstall(async ({ effects }) => {
  await store.write(effects, {
    pages: [],
    ports: [],
  })
})

// **** PostInstall ****
const postInstall = sdk.setupPostInstall(async ({ effects }) => {
  await sdk.action.requestOwn(effects, config, 'important', {
    reason: 'Create your first website!',
  })
})
// **** Uninstall ****
const uninstall = sdk.setupUninstall(async ({ effects }) => {})

/**
 * Plumbing. DO NOT EDIT.
 */
export const { packageInit, packageUninit, containerInit } = sdk.setupInit(
  versions,
  preInstall,
  postInstall,
  uninstall,
  setInterfaces,
  setDependencies,
  actions,
)
