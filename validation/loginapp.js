const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validatorLoginInput(data) {
  let errors = {}

  data.stuId = !isEmpty(data.stuId) ? data.stuId : ''
  data.password = !isEmpty(data.password) ? data.password : ''

  if (Validator.isEmpty(data.stuId)) {
    errors.stuId = '学号不能为空'
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = '密码不能为空'
  }

  if (!Validator.isLength(data.password, {min:6, max: 30})) {
    errors.password = '密码长度不能小于6位且不能超过30位'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}