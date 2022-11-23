// 云函数入口文件
const isLocal = process.env.TENCENTCLOUD_RUNENV !== 'SCF'
const localLibPath = '../../common/cf-lib/'
const cloud = require(isLocal? localLibPath + 'node_modules/wx-server-sdk': 'wx-server-sdk')
const exception = require(isLocal ? localLibPath + 'exception':'exception')
const response = require(isLocal? localLibPath + 'response': 'response')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
    const { OPENID } = cloud.getWXContext()
    const userScoreCollection = await db.collection('user_score')
        .where({
            _openid: OPENID
        }).field({
            score: true
        }).get()
    const data = userScoreCollection.data.length ? userScoreCollection.data[0] : { score: 0 }
    return response.success(data)

}