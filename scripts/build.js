const fs = require('fs')
const glob = require('glob');
const packageJson = require('../package.json')

packageJson.workspaces.forEach(workspaceDir => {
  glob(workspaceDir + '/dist/index.js', null, function (err, files) {
    files.forEach(filepath => {
      const destPath = './dist/' + filepath.replace('/dist', '').replace('/packages')
      fs.mkdirSync(destPath.replace('/index.js', ''), { recursive: true })
      fs.copyFile(filepath, destPath, err => { })
    });
  })
})
