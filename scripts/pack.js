const { execSync } = require('child_process')
const { mkdirSync, existsSync } = require('fs')
const glob = require('glob')
const path = require('path')
const rootPackageJson = require('../package.json')

if (!existsSync('dist')) {
  mkdirSync('dist')
}

rootPackageJson.workspaces.forEach(workspaceDir => {
  glob(workspaceDir, null, function (err, files) {
    files.forEach(packagePath => {
      const packageLocation = path.resolve(__dirname, '..', packagePath)
      execSync(`npm pack ${packageLocation}`, { cwd: path.resolve(__dirname, '..', 'dist') })
    });
  })
})

