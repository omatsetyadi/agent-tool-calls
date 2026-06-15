/**
 * @agent-tool-calls/machine-core — the machine adapter contract.
 *
 * Capability types, the injectable shell `Runner`, `Platform`, and shared cross-platform
 * helpers for the genuinely OS-agnostic operations (fs/process). No platform-specific shell
 * code lives here — per-OS adapters (`machine-darwin`/`-win32`/`-linux`) depend on this and
 * implement the rest. Zero runtime deps.
 */

import { readdir, rm } from 'node:fs/promises'

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

/** Host operating system. */
export type Platform = 'mac' | 'windows' | 'linux'

const PLATFORM_BY_NODE: Partial<Record<NodeJS.Platform, Platform>> = {
  win32: 'windows',
  darwin: 'mac',
  linux: 'linux',
}

/** Map Node's `process.platform` to a `Platform`; unknown unix-likes fall back to 'linux'. */
export function currentPlatform(): Platform {
  return PLATFORM_BY_NODE[process.platform] ?? 'linux'
}

/** The set of operations a machine adapter can expose. A const object (no magic strings); each
 *  adapter advertises the subset it actually supports via {@link MachineAdapter.capabilities}. */
export const MachineOp = {
  OPEN_APP: 'openApp',
  PLAY_MEDIA: 'playMedia',
  LIST_DIRECTORY: 'listDirectory',
  DELETE_FILE: 'deleteFile',
  KILL_PROCESS: 'killProcess',
  LIST_PROCESSES: 'getRunningProcesses',
  MEDIA_PREVIOUS: 'mediaPrevious',
  MEDIA_NEXT: 'mediaNext',
  MEDIA_PLAY_PAUSE: 'mediaPlayPause',
} as const
export type MachineOp = (typeof MachineOp)[keyof typeof MachineOp]

/** A cross-platform machine adapter. The base operations are universal; media transport is
 *  optional (present only where the OS supports it). `capabilities()` advertises exactly which
 *  ops this adapter implements on this host, so consumers expose only what's real. Growth is
 *  additive: add a `MachineOp`, implement it where supported, and advertise it. */
export interface MachineAdapter {
  openApp(name: string): Promise<void>
  playMedia(uri: string): Promise<void>
  listDirectory(path: string): Promise<FileEntry[]>
  deleteFile(path: string): Promise<void>
  killProcess(pid: number): Promise<void>
  getRunningProcesses(): Promise<ProcessInfo[]>
  mediaPrevious?(): Promise<void>
  mediaNext?(): Promise<void>
  mediaPlayPause?(): Promise<void>
  capabilities(): ReadonlySet<MachineOp>
}

// ── shared helpers (genuinely cross-platform; adapters compose these) ────────
export async function listDirectory(path: string): Promise<FileEntry[]> {
  const ents = await readdir(path, { withFileTypes: true })
  return ents.map((e) => ({ name: e.name, isDirectory: e.isDirectory() }))
}

export async function deleteFile(path: string): Promise<void> {
  await rm(path)
}

export async function killProcess(pid: number): Promise<void> {
  process.kill(pid)
}
