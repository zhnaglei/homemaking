exports.baseException = class BaseException{
    errorCode
    message
    constructor(errCode, message) {
        this.errorCode = errCode
        this.message =message
    }
}