/**
 * @agent-tool-calls/machine — cross-platform OS operations.
 *
 * Real Mac implementation + Windows stub. Platform is selected at runtime.
 * No Timmy or AI-framework imports — this stays a plain, reusable library.
 */

import { MacAdapter } from './mac'
import { WindowsAdapter } from './windows'
import type { MachineAdapter } from './types'

export * from './types'

export type Platform = 'mac' | 'windows' | 'linux'

export function currentPlatform(): Platform {
  switch (process.platform) {
    case 'win32':
      return 'windows'
    case 'darwin':
      return 'mac'
    default:
      return 'linux'
  }
}

export function createMachine(): MachineAdapter {
  switch (process.platform) {
    case 'win32':
      return new WindowsAdapter()
    case 'darwin':
      return new MacAdapter()
    default:
      throw new Error(
        `@agent-tool-calls/machine: platform '${process.platform}' is not supported yet (only macOS; Windows stub lands in Phase 11)`,
      )
  }
}
