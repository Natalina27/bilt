#!/usr/bin/env node
const path = require('path')
const artifactFinderFactory = require('../../../artifacts/artifact-finder')
const {createSymlink} = require('../../../fs/symlink')

main().catch(err => console.error(err.stack))

async function main() {
  const artifactFinder = await artifactFinderFactory()

  const repoDirectory = path.resolve(__dirname, '../../../..')
  console.log('finding artifacts in', repoDirectory)
  const artifacts = (await artifactFinder.findArtifacts(repoDirectory)).filter(a =>
    a.path.startsWith('packages/'),
  )
  console.log(artifacts.map(artifact => artifact.name).join('\n'))

  await Promise.all(
    artifacts.map(async artifact => {
      await createSymlink(
        path.join(repoDirectory, 'node_modules', artifact.name),
        path.resolve(repoDirectory, artifact.path),
      )
    }),
  )

  await createSymlink(
    path.join(repoDirectory, 'packages/cli/bilt-cli/node_modules/plugin-import'),
    path.join(repoDirectory, 'packages/plugins/plugin-import'),
  )

  await createSymlink(
    path.join(
      repoDirectory,
      'packages/repository/repo-build-job/node_modules/@bilt/artifact-finder',
    ),
    path.join(repoDirectory, 'packages/artifacts/artifact-finder'),
  )
}