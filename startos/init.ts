import { sdk } from './sdk'
import { exposedStore, initStore } from './store'
import { setDependencies } from './dependencies'
import { setInterfaces } from './interfaces'
import { versions } from './versions'
import { actions } from './actions'
import { config } from './actions/config/config'

// **** PreInstall ****
const preInstall = sdk.setupPreInstall(async ({ effects }) => {})

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
  initStore,
  exposedStore,
)
