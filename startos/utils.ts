import { utils } from '@start9labs/start-sdk'

export function getLowercaseAlphaString() {
  return utils.getDefaultString({
    charset: 'a-z',
    len: 10,
  })
}

export function createPortGenerator(usedPorts: Set<number>, start = 8000) {
  let current = start
  while (usedPorts.has(current)) {
    current++
  }
  return current++
}
