import type { MachineAdapter } from './types'

const ni = (op: string) => async (): Promise<never> => {
  throw new Error(`WindowsAdapter.${op} not implemented (Phase 11 Windows port)`)
}

export class WindowsAdapter implements MachineAdapter {
  openApp = ni('openApp')
  playMedia = ni('playMedia')
  listDirectory = ni('listDirectory')
  deleteFile = ni('deleteFile')
  killProcess = ni('killProcess')
  getRunningProcesses = ni('getRunningProcesses')
}
