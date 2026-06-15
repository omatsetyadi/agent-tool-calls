import { describe, it, expect } from 'vitest'
import { mkdtempSync, writeFileSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { MachineOp, currentPlatform, listDirectory, deleteFile } from './index'

describe('MachineOp', () => {
  it('exposes stable op names', () => {
    expect(MachineOp.OPEN_APP).toBe('openApp')
    expect(MachineOp.MEDIA_PLAY_PAUSE).toBe('mediaPlayPause')
  })
})

describe('currentPlatform', () => {
  it('returns one of the three supported platforms', () => {
    expect(['mac', 'windows', 'linux']).toContain(currentPlatform())
  })
})

describe('shared helpers', () => {
  it('listDirectory returns entries with isDirectory flags', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'mc-'))
    writeFileSync(join(dir, 'a.txt'), 'x')
    const entries = await listDirectory(dir)
    expect(entries.find((e) => e.name === 'a.txt')).toEqual({ name: 'a.txt', isDirectory: false })
  })

  it('deleteFile removes a file', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'mc-'))
    const f = join(dir, 'gone.txt')
    writeFileSync(f, 'x')
    await deleteFile(f)
    expect(existsSync(f)).toBe(false)
  })
})
