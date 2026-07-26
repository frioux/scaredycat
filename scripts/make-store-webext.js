/*
 * Derive the Chrome Web Store copy of the built extension.
 *
 * The manifest `key` pins the extension ID for unpacked development loads -
 * without it, the ID is derived from the load path, so it changes whenever
 * the path does, and removing the key mid-stream splits an existing install
 * into a broken ghost registration plus a new-ID duplicate. But the Web
 * Store rejects manifests that carry a `key` (it assigns its own). So
 * build/webext keeps the key for local loads, and this script copies it to
 * build/webext-store with the key stripped for upload.
 */
'use strict'

const fs = require('fs')
const path = require('path')

function storeManifest (manifest) {
  const out = { ...manifest }
  delete out.key
  return out
}

module.exports = { storeManifest }

if (require.main === module) {
  const src = process.argv[2] || path.join('build', 'webext')
  const dest = process.argv[3] || path.join('build', 'webext-store')
  fs.rmSync(dest, { recursive: true, force: true })
  fs.cpSync(src, dest, { recursive: true })
  const manifestPath = path.join(dest, 'manifest.json')
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  fs.writeFileSync(manifestPath, JSON.stringify(storeManifest(manifest)))
  console.log(`make-store-webext: wrote ${dest}`)
}
