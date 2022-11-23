const validator = require('./validator.min')
const { baseException } = require('./exception')

/**
 * 基于 validator.js 二次封装的参数验证类库。
 * validator.js 仓库： @url https://github.com/validatorjs/validator.js
 * @type {ImoocValidator}
 * 1. 支持批量验证。自动遍历参数列表的每一个元素，依次进行参数验证；每个元素的验证规则支持配置一条或多条验证规则。
 * 2. 验证不通过时的反馈形式，形式可灵活配置，支持抛出异常或着以返回值的方式返回错误信息。
 */
exports.imoocValidator = class ImoocValidator {
    /**
     * 待验证的参数列表
     * @type {Object}
     */
    _data = {}
    /**
     * 验证规则配置
     * @type {Object}
     * @private
     * 1. _rules 必须是一个 Object 对象
     * 2. _rules 的 key 代表要验证的参数名。
     * 格式如下：
     * {
     *     username: {}
     *     content: {}
     * }
     *
     * 3. key 的 value 也是一个Object对象，代表这个参数的验证规则
     * 验证规则格式如下：
     * {
     *     content: {
     *        required: Boolean  可选；验证参数是否必填，false或不配置代表参数非必填
     *        _rules: Array[ruleItem]  必选；验证规则。required = true 时至少传入一个 ruleItem，传入多个代表多个验证规则。
     *     }
     * }
     * 注意：参数非必填且没有传递参数时，不会触发验证。参数非必填但传递了参数时，会按 _rules 内配置的规则验证。
     *
     * 4. ruleItem 也是一个Object 对象，格式如下：
     * {
     *     name: String  必选，验证规则名称，必须与 validator.js 提供的验证函数的函数名一致。
     *     params: String  可选，对应 validator.js 某些验证函数的第二个可选参数
     *     options: Object  可选，对应 validator.js 某些验证函数的可选第三个可选参数
     *     message: String  可选，自定义错误提示信息，默认文本：参数不合法
     * }
     * 5. 配置示例：
     * {
     *   // 验证目标的参数名
     *   content: {
     *       // 不是必填的参数
     *       required: false,
     *       // 参数的验证规则；如参数列表中存在 content 字段，按照一下规则验证
     *       _rules: [
     *           // 规则1
     *           {
     *               // 使用 validator.js 的 isLength() 进行验证
     *               name: 'isLength',
     *               options: {
     *                   // 字符串最小长度为 10
     *                   min: 10,
     *                   // 字符串最大长度为 40
     *                   max: 40
     *               }
     *           },
     *           // 规则2
     *           {
     *               // 使用 validator.js 的 matches() 进行验证
     *               name: 'matches',
     *               // 中文正则表达式
     *               params: /^[\u4e00-\u9fa5]*$/,
     *               // 自定义错误消息
     *               message: '内容必须是纯中文'
     *           }
     *      ],
     *   }
     * }
     */
    _rules = {}
    /**
     * 是否批量验证
     * @type {boolean}
     */
    _batch = true
    /**
     * 验证失败是否抛出异常
     * @type {Boolean}
     */
    _throwError = true
    /**
     * 验证失败的错误信息
     * @type {Object}
     */
    _errors = {}

    validate() {
        // 1. 前置验证
        this._preValidate()
        // 2. 参数必填验证
        this._requireValidate()
        // 3. 规则验证
        this._ruleValidate()

        if (Object.keys(this._errors).length && this._throwError) {
            throw new ParameterException(10000, this._errors)
        }

        return this._errors
    }

    _preValidate() {
        if (typeof this._data !== "object") {
            throw Error("参数 data 的类型必须是 Object")
        }

        if (typeof this._rules !== 'object') {
            throw Error("参数 rules 的类型必须是 Object")
        }

        if (typeof this._batch !== 'boolean') {
            throw Error("参数 batch 的类型必须是 Boolean")
        }

        if (typeof this._throwError !== 'boolean') {
            throw Error("参数 throwError 的类型必须是 Boolean")
        }
    }

    _requireValidate() {
        const _rulesDemo = {
            content: {
                required: false,
                _rules: [
                    // 规则1
                    {
                        name: 'isLength',
                        options: {
                            min: 10,
                            max: 40
                        }
                    },
                    // 规则2
                    {
                        name: 'matches',
                        params: /^[\u4e00-\u9fa5]*$/,
                        message: '内容必须是纯中文'
                    }
                ],
            }
        }
        let filteredRules = {}
        for (const parameterName in this._rules) {
            const parameterRule = this._rules[parameterName]
            const parameterValue = this._convertToStr(this._data[parameterName])

            // 1. 参数必填但没有传递
            if (parameterRule.required && !parameterValue) {
                // 记录错误信息
                this._errors[parameterName] = `${parameterName}参数不能为空`
                if (!this._batch) {
                    filteredRules = {}
                    break
                }
                continue
            }
            // 2. 参数非必填，实际也没有传递
            if (!parameterRule.required && !parameterValue) {
                continue
            }

            // 3. 实际传递了值，需要参与后续的内容规则校验
            filteredRules[parameterName] = parameterRule
        }
        this._rules = filteredRules
    }

    _ruleValidate() {
        const _rulesDemo = {
            content: {
                required: false,
                _rules: [
                    // 规则1
                    {
                        name: 'isLength',
                        options: {
                            min: 10,
                            max: 40
                        }
                    },
                    // 规则2
                    {
                        name: 'matches',
                        params: /^[\u4e00-\u9fa5]*$/,
                        message: '内容必须是纯中文'
                    }
                ],
            }
        }
        for (const parameterName in this._rules) {
            const parameterRule = this._rules[parameterName]
            const unverifiedData = this._convertToStr(this._data[parameterName])

            const batchValidateRes = this._batchValidate(unverifiedData, parameterName, parameterRule)
            if (!batchValidateRes && !this._batch) {
                break
            }
        }
    }

    _batchValidate(unverifiedData, parameterName, parameterRule) {
        const _rulesDemo = {
            content: {
                required: false,
                _rules: [
                    // 规则1
                    {
                        name: 'isLength',
                        options: {
                            min: 10,
                            max: 40
                        }
                    },
                    // 规则2
                    {
                        name: 'matches',
                        params: /^[\u4e00-\u9fa5]*$/,
                        message: '内容必须是纯中文'
                    }
                ],
            }
        }
        let batchValidateRes = true
        for (let i = 0; i < parameterRule.rules.length; i++) {
            const ruleItem = parameterRule.rules[i]
            if (!ruleItem.name) {
                throw Error(`${parameterName}未指定验证规则`)
            }

            batchValidateRes = this._singleValidate(unverifiedData, ruleItem)
            if (batchValidateRes) {
                continue
            }

            const errorMessage = ruleItem.message || '参数不合法'
            this._errors[parameterName] = this._errors[parameterName]
                ? `${this._errors[parameterName]};${errorMessage}`
                : errorMessage

            if (!this._batch) {
                break
            }
        }

        return batchValidateRes
    }

    _singleValidate(unverifiedData, ruleItem) {
        const funcParameters = [unverifiedData]

        if (ruleItem.params) {
            funcParameters.push(ruleItem.params)
        }

        if (ruleItem.options) {
            funcParameters.push(ruleItem.options)
        }

        return validator[ruleItem.name](...funcParameters)
    }

    _convertToStr(value) {
        if (typeof value === 'undefined' || value === null) {
            return ''
        }

        return typeof value === 'string' ? value : value.toString()
    }

}

class ParameterException extends baseException {
    constructor(errorCode, message) {
        super(errorCode, message);
    }
}