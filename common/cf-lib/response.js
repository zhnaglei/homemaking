const exception = require('./exception')
exports.success = function (data=null, message='ok', errorCode=0) {
    return {
        error_code: errorCode,
        message,
        data
    }
}

exports.fail =function (error=null,functionName){
    if(error instanceof  exception.baseException){
        return {
            error_code: error.errorCode,
            message: error.message,
            request: functionName
        }
    }
    return {
        error_code: 10025,
        message: '服务器开小差了，请稍后重试',
        request: functionName
    }
}
