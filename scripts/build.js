const ci = require('miniprogram-ci');
const { config } = require('./config');
(async () => {
    const project = new ci.Project({
        appid: config.appid,
        type: config.compileType,
        projectPath: config.projectPath,
        privateKeyPath: config.privateKeyPath,
        ignores: []
    })

    // 在有需要的时候构建npm
    const warning = await ci.packNpm(project, {
        ignores: [`${config.cloudFuncRoot}**/*`, `${config.cloudFuncLib}/**/*`],
        reporter: (infos) => {
            console.log(infos)
        }
    })
    console.warn(warning)
})()