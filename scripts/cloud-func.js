const fs = require('fs')
const ci = require('miniprogram-ci');
const { config } = require('./config');
(async () => {
    if(!config.cloudFuncRoot){
        return
    }
    const project = new ci.Project({
        appid: config.appid,
        type: config.compileType,
        projectPath: config.projectPath,
        privateKeyPath: config.privateKeyPath,
        ignores: ['node_modules/**/*'],
    })
    const cloudFuncList = fs.readdirSync(config.cloudFuncPath)
    for (const cloudFuncName of cloudFuncList) {
        if(cloudFuncName.startsWith('.')){
            continue
        }
        const result = await ci.cloud.uploadFunction({
            project,
            env: config.APIConfig.cloudEnv,
            name: cloudFuncName,
            path: config.cloudFuncPath + cloudFuncName,
            remoteNpmInstall: true, // 是否云端安装依赖
        })
        console.warn(result)
    }
    console.log('Cloud function upload done!!')
})()