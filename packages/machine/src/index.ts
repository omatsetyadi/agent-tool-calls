/**
 * @agent-tool-calls/machine — cross-platform OS operations.
 *
 * Phase 0: scaffold only. Real Mac/Windows implementations land in Phase 3.
 * No Timmy or AI-framework imports — this stays a plain, reusable library.
 */

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

// Implementations arrive in Phase 3:
// export async function openApp(name: string): Promise<void> { ... }
// export async function playMedia(uri: string): Promise<void> { ... }
// export async function listDirectory(path: string): Promise<FileEntry[]> { ... }
// export async function deleteFile(path: string): Promise<void> { ... }
// export async function killProcess(pid: number): Promise<void> { ... }
