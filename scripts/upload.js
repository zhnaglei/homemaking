const ci = require('miniprogram-ci')
const { config } = require('./config')
const fs = require('fs');
(async () => {
    const project = new ci.Project({
        appid: config.appid,
        type: config.compileType,
        projectPath: config.projectPath,
        privateKeyPath: config.privateKeyPath,
        ignores: ['node_modules/**/*', `${config.cloudFuncRoot}**/*`,
            `${config.cloudFuncLib}/**/*`,
            'scripts/*'],
    })

    let descTextBuffer = fs.readFileSync(config.descTextPath);
    const uploadResult = await ci.upload({
        project,
        version: config.version,
        desc: descTextBuffer,
        setting: {
            es6: true,
            es7: true,
            minify: true,
            autoPrefixWXSS: true
        },
        onProgressUpdate: console.log,
    })
    console.log(uploadResult)
})()