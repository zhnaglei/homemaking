const ci = require('miniprogram-ci');
(async () => {
    const project = new ci.Project({
        appid: 'wxa4fdf17310b16a4b',
        type: 'miniProgram',
        projectPath: '/Users/keepzc/Documents/WeChatProjects/homemaking',
        privateKeyPath: '/Users/keepzc/Documents/WeChatProjects/homemaking/scripts/secret.key',
        ignores: ['node_modules/**/*'],
    })
    const uploadResult = await ci.upload({
        project,
        version: '1.1.1',
        desc: '这是使用CI上传',
        setting: {
            es6: true,
        },
        onProgressUpdate: console.log,
    })
    console.log(uploadResult)
})()
