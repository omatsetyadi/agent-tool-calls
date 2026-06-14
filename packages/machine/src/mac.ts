import { readdir, rm } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import type { FileEntry, MachineAdapter, ProcessInfo, Runner } from './types'

const defaultRunner: Runner = async (cmd, args) => {
  const { stdout } = await promisify(execFile)(cmd, args)
  return { stdout }
}

export class MacAdapter implements MachineAdapter {
  constructor(private readonly run: Runner = defaultRunner) {}

  async openApp(name: string): Promise<void> {
    await this.run('open', ['-a', name])
  }

  async playMedia(uri: string): Promise<void> {
    await this.run('open', [uri])
  }

  async listDirectory(path: string): Promise<FileEntry[]> {
    const ents = await readdir(path, { withFileTypes: true })
    return ents.map((e) => ({ name: e.name, isDirectory: e.isDirectory() }))
  }

  async deleteFile(path: string): Promise<void> {
    await rm(path)
  }

  async killProcess(pid: number): Promise<void> {
    process.kill(pid)
  }

  async getRunningProcesses(): Promise<ProcessInfo[]> {
    const { stdout } = await this.run('ps', ['-axo', 'pid=,comm='])
    return stdout
      .trim()
      .split('\n')
      .map((line) => {
        const m = line.trim().match(/^(\d+)\s+(.*)$/)
        return m ? { pid: Number(m[1]), name: m[2] } : null
      })
      .filter((p): p is ProcessInfo => p !== null)
  }
}
