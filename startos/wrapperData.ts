import { ConfigSpec } from './procedures/config/spec'

/**
 * Here you define the set of data that the service wrapper will persist for self consumption and for exporting to users and other services
 *
 * It is conventional for the "config" key to store the service's saved config, excluding sensitive data like passwords
 */
export interface WrapperData {
  config: ConfigSpecExtended
}
export type Domain = ConfigSpec["domains"][0]
export interface DomainWithId extends Domain {
  id: string
}
export interface ConfigSpecExtended extends ConfigSpec {
  domains: DomainWithId[]
}
