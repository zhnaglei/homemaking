require("@babel/register")
const path = require('path');
// CommonJs
const { appid, compileType, cloudfunctionRoot } = require('../project.config.json')
const { version } = require('../package.json');

const projectPath = path.join(__dirname, '../')
const privateKeyPath = path.join(__dirname, 'secret.key')
const cloudFuncPath = path.join(projectPath, cloudfunctionRoot)
const cloudFuncLib = path.join(projectPath, 'common', 'cf-lib')
const descTextPath = path.join(__dirname, 'desc.txt')
const APIConfig = require("../config/api").default

exports.config = {
    appid,
    compileType,
    cloudFuncRoot: cloudfunctionRoot,
    cloudFuncPath: cloudFuncPath,
    version,
    projectPath,
    privateKeyPath,
    cloudFuncLib,
    descTextPath,
    APIConfig
}