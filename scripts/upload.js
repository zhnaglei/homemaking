const ci = require('miniprogram-ci');
const { config } = require('./config');
(async () => {
    const project = new ci.Project({
        appid: config.appid,
        type: config.compileType,
        projectPath: config.projectPath,
        privateKeyPath: config.privateKeyPath,
        ignores: ['node_modules/**/*', `${config.cloudFuncRoot}**/*`, 'scripts/*'],
    })
    const uploadResult = await ci.upload({
        project,
        version: config.version,
        desc: '这是使用CI上传',
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
