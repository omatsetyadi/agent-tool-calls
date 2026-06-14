export interface FileEntry {
  name: string
  isDirectory: boolean
}

export interface ProcessInfo {
  pid: number
  name: string
}

/** Injectable shell runner so adapters are unit-testable without real side effects. */
export type Runner = (cmd: string, args: string[]) => Promise<{ stdout: string }>

export interface MachineAdapter {
  openApp(name: string): Promise<void>
  playMedia(uri: string): Promise<void>
  listDirectory(path: string): Promise<FileEntry[]>
  deleteFile(path: string): Promise<void>
  killProcess(pid: number): Promise<void>
  getRunningProcesses(): Promise<ProcessInfo[]>
}
