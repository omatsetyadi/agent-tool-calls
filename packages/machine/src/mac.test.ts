import { describe, it, expect, vi } from 'vitest'
import { mkdtempSync, writeFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { MacAdapter } from './mac'

describe('MacAdapter', () => {
  it('listDirectory returns entries with isDirectory', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'm-'))
    writeFileSync(join(dir, 'a.txt'), 'x')
    const a = new MacAdapter()
    const entries = await a.listDirectory(dir)
    expect(entries.find((e) => e.name === 'a.txt')).toEqual({ name: 'a.txt', isDirectory: false })
  })
  it('deleteFile removes the file', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'm-'))
    const f = join(dir, 'gone.txt')
    writeFileSync(f, 'x')
    await new MacAdapter().deleteFile(f)
    expect(existsSync(f)).toBe(false)
  })
  it('openApp shells out to `open -a` (via injected runner)', async () => {
    const run = vi.fn(async () => ({ stdout: '' }))
    await new MacAdapter(run).openApp('Spotify')
    expect(run).toHaveBeenCalledWith('open', ['-a', 'Spotify'])
  })
  it('getRunningProcesses parses `ps` output into ProcessInfo[]', async () => {
    const run = vi.fn(async () => ({ stdout: '  123 Finder\n  456 Safari\n' }))
    const procs = await new MacAdapter(run).getRunningProcesses()
    expect(run).toHaveBeenCalledWith('ps', ['-axo', 'pid=,comm='])
    expect(procs).toEqual([
      { pid: 123, name: 'Finder' },
      { pid: 456, name: 'Safari' },
    ])
  })
  it('getRunningProcesses returns [] for empty output', async () => {
    const run = vi.fn(async () => ({ stdout: '' }))
    expect(await new MacAdapter(run).getRunningProcesses()).toEqual([])
  })
})
