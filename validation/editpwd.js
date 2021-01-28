const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validatorEditPwdInput(data) {
  let errors = {}

  data.stuId = !isEmpty(data.stuId) ? data.stuId : ''
  data.phone = !isEmpty(data.phone) ? data.phone : ''
  data.password = !isEmpty(data.password) ? data.password : ''
  data.password2 = !isEmpty(data.password2) ? data.password2 : ''

  if (Validator.isEmpty(data.stuId)) {
    errors.stuId = '学号不能为空'
  }

  if (!Validator.isMobilePhone(data.phone)) {
    errors.phone = '手机号不合法'
  }

  if (Validator.isEmpty(data.phone)) {
    errors.phone = '手机号不能为空'
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = '密码不能为空'
  }

  if (!Validator.isLength(data.password, {min:6, max: 30})) {
    errors.password = '密码长度不能小于6位且不能超过30位'
  }

  if (Validator.isEmpty(data.password2)) {
    errors.password = '密码2不能为空'
  }

  if (!Validator.equals(data.password, data.password2)) {
    errors.password = '两次密码不一致'
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}