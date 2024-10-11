import { sdk } from './sdk'
import { setDependencies } from './dependencies'
import { setupInterfaces } from './interfaces'
import { versions } from './versions'
import { actions } from './actions'


const install = sdk.setupInstall(async ({ effects }) => {})

const uninstall = sdk.setupUninstall(async ({ effects }) => {})

/**
 * Plumbing. DO NOT EDIT.
 */
export const { packageInit, packageUninit, containerInit } = sdk.setupInit(
  versions,
  install,
  uninstall,
  setupInterfaces,
  setDependencies,
  actions
)
