import { checkPortListening } from '@start9labs/start-sdk/lib/health/checkFns'
import exportInterfaces from '@start9labs/start-sdk/lib/mainFn/exportInterfaces'
import { ExpectedExports } from '@start9labs/start-sdk/lib/types'
import { WrapperData } from '../wrapperData'
import { NetworkInterfaceBuilder } from '@start9labs/start-sdk/lib/mainFn/NetworkInterfaceBuilder'
import { HealthReceipt } from '@start9labs/start-sdk/lib/health/HealthReceipt'
import { Daemons } from '@start9labs/start-sdk/lib/mainFn/Daemons'
import { setupMain } from '@start9labs/start-sdk/lib/mainFn'
import { AddressReceipt } from '@start9labs/start-sdk/lib/mainFn/AddressReceipt'

export const main: ExpectedExports.main = setupMain<WrapperData>(
  async ({ effects, utils, started }) => {
    /**
     * ======================== Setup ========================
     *
     * In this section, you will fetch any resources or run any commands necessary to run the service
     */
    await effects.console.info('Starting Start9 Pages...')
    const bucketSize = 128
    await effects.appendFile({ path: '/etc/nginx/http.d/default.conf', volumeId: 'main', toWrite: `server_names_hash_bucket_size ${bucketSize};` })

    /**
     * ======================== Interfaces ========================
     *
     * In this section, you will decide how the service will be exposed to the outside world
     *
     * Naming convention reference: https://developer.mozilla.org/en-US/docs/Web/API/Location
     */

    // ------------ Tor ------------

    // loop over configured domains and set their
    const config = await effects.getWrapperData<WrapperData, '/config'>({ path: '/config', callback: () => {} })
    let addressReceipts: AddressReceipt[] = []
    for (const domain of config.domains){
      // Find or generate a random Tor hostname by ID
      const torHostname = utils.torHostName(`${domain.id}`)
      // Create a Tor host with the assigned port mapping
      const torHostHttp = await torHostname.bindTor(8080, 80)
      // Assign the Tor host a web protocol (e.g. "http", "ws")
      const torOriginHttp = torHostHttp.createOrigin('http')
      // Create another Tor host with the assigned port mapping
      const torHostHttps = await torHostname.bindTor(8443, 443)
      // Assign the Tor host a web protocol (e.g. "https", "wss")
      const torOriginHttps = torHostHttps.createOrigin('https')
      // Define the Interface for user display and consumption
      const webInterface = new NetworkInterfaceBuilder({
        effects,
        name: `Web UI for ${domain.label}`,
        id: `webui-${domain.id}`,
        description: `The web interface for ${domain.label}`,
        ui: true,
        basic: null,
        path: '',
        search: {},
      })
      // Choose which origins to attach to this interface. The resulting addresses will share the attributes of the interface (name, path, search, etc)
      addressReceipts.push(await webInterface.export([torOriginHttp, torOriginHttps]))
    }
    
    // Export all address receipts for all interfaces to obtain interface receipt
    const interfaceReceipt = exportInterfaces(addressReceipts)

    /**
     * ======================== Additional Health Checks (optional) ========================
     *
     * In this section, you will define additional health checks beyond those associated with daemons
     */
    const healthReceipts: HealthReceipt[] = []

    /**
     * ======================== Daemons ========================
     *
     * In this section, you will create one or more daemons that define the service runtime
     *
     * Each daemon defines its own health check, which can optionally be exposed to the user
     */
    return Daemons.of({
      effects,
      started,
      interfaceReceipt, // Provide the interfaceReceipt to prove it was completed
      healthReceipts, // Provide the healthReceipts or [] to prove they were at least considered
    }).addDaemon('hosting-instance', {
      command: ['nginx', '-g', 'daemon off;'], // The command to start the daemon
      ready: {
        display: 'Hosting Instance',
        // The function to run to determine the health status of the daemon
        fn: () =>
          checkPortListening(effects, 8080, {
            timeout: 10_000,
            successMessage: 'Page hosting is fully operational',
            errorMessage: 'Page hosting is not functional',
          }),
      },
      requires: [],
    })
  }
)
