// 云函数入口文件
const isLocal = process.env.TENCENTCLOUD_RUNENV !== 'SCF'
const localLibPath = '../../common/cf-lib/'
const cloud = require(isLocal? localLibPath + 'node_modules/wx-server-sdk': 'wx-server-sdk')
const moment = require('moment')
const exception = require(isLocal ? localLibPath + 'exception':'exception')
const response = require(isLocal? localLibPath + 'response': 'response')
// const { imoocValidator } = require(isLocal ? localLibPath + 'imooc-validator' : 'imooc-validator')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
const nowServerDate = db.serverDate()
// 云函数入口函数
exports.main = async (event, context) => {
    const { OPENID } = cloud.getWXContext()
    // events = {
    //     // TODO 必填；必须是一个合法的邮箱地址格式
    //     username: 'qinchenjugmail.com',
    //     // TODO 必填；必须大于等于 18
    //     age: 15,
    //     // TODO 必填；至少 10 个字符，最长不超过 40个字符；必须是中文
    //     content: '老黄人带着小黄人去慕课网imooc',
    //     // TODO 非必填
    //     create_time: '2022-02-22'
    // }
    try{
        // const res = new SignInValidator(events).validate()
        // console.log(res, '-----')
        // return response.success(res)
        //1. 记录签到
        // throw new SignInException(999,'这是自定义异常')
        const signInLog = await _getSignInLogByOpenid(OPENID)
        await db.runTransaction(async transaction=> {
            if(!signInLog.data.length){
                const createRes = await _createSignInLog(transaction ,OPENID)
            }else {
                //更新最后签到时间
                const updateRes = await _updateSignInLog(transaction, signInLog.data[0])
                if(!updateRes.stats.updated){
                    throw new SignInException(10027,'签到失败，请稍后重试')
                }
            }
            //事务
            // mock
            // throw Error('出错')
            //2. 更新用户积分
            const userScore = await _getUserScoreByOpenId(OPENID)
            if(!userScore.data.length){
                const res =  await _createUserScore(transaction, OPENID)
                return
            }
            const updateUserScoreRes = await _updateUserScore(transaction, userScore.data[0]._id)
            if(!updateUserScoreRes.stats.updated){
                throw new SignInException(10028,'签到失败，请稍后重试')
            }
        })
    }catch (e) {
        console.log(e)
        //1。 代码异常 2。云开发相关异常 3。主动抛出自定义异常
        return response.fail(e,'signin')
    }
    return  response.success()

}

// class SignInValidator extends imoocValidator{
//     _rules = {
//         username: {
//             required: true,
//             rules: [
//                 {
//                     name: 'isEmail',
//                 },
//             ]
//         },
//         age: {
//             required: true,
//             rules: [
//                 {
//                     name: 'isInt',
//                     options: {
//                         min: 18
//                     },
//                     message: '未满 18 岁，不能访问'
//                 },
//             ]
//         },
//         content: {
//             required: true,
//             rules: [
//                 {
//                     name: 'isLength',
//                     options: {
//                         min: 10,
//                         max: 40
//                     }
//                 },
//                 {
//                     name: 'matches',
//                     params: /^[\u4e00-\u9fa5]*$/,
//                     message: '内容必须是纯中文'
//                 }
//             ],
//         }
//     }
//     _batch = false
//     _throwError = false
//     constructor(data) {
//         super();
//         this._data = data
//     }
// }

class SignInException extends exception.baseException{
    constructor(errCode,message) {
        super(errCode, message);
    }
}

async function _getSignInLogByOpenid(openid){
    return db.collection('log_sign_in').where({_openid: openid}).get()
}

async function _createSignInLog(transaction, openid){
    return transaction.collection('log_sign_in').add({
        data:{
            _openid: openid,
            create_time: nowServerDate,
            update_time: nowServerDate
        }
    })
}

async function _updateSignInLog(transaction,signInLog){
    //1 此刻的日期和记录的最后一次签到时间距离多久
    const dateDiff = moment().diff(moment(signInLog.update_time), 'days')
    if(dateDiff === 0){
        throw new SignInException(10026,'今天已经签到了')
    }
    return transaction.collection('log_sign_in').doc(signInLog._id).update({
        data:{
            update_time: nowServerDate
        }
    })
}

async function _getUserScoreByOpenId(openid){
    return db.collection('user_score').where({_openid: openid}).get()
}

async function _createUserScore(transaction,openid){
    return transaction.collection('user_score').add({
        data:{
            _openid: openid,
            score: 5,
            create_time: nowServerDate,
            update_time: nowServerDate
        }
    })
}

async function _updateUserScore(transaction,docId){
    // 原子自增
    return transaction.collection('user_score').doc(docId).update({
        data:{
            score: db.command.inc(5),
            update_time: nowServerDate
        }
    })
}