const Validator = require('validator')
const isEmpty = require('./is-empty')

module.exports = function validatorRegisterInput(data) {
  let errors = {}

  data.name = !isEmpty(data.name) ? data.name : ''
  data.stuId = !isEmpty(data.stuId) ? data.stuId : ''
  data.phone = !isEmpty(data.phone) ? data.phone : ''
  data.email = !isEmpty(data.email) ? data.email : ''
  data.password = !isEmpty(data.password) ? data.password : ''
  data.password2 = !isEmpty(data.password2) ? data.password2 : ''

  if(!Validator.isLength(data.name, {min:2, max: 30})) {
    errors.name = "名字长度不能小于两位且不能超过30位"
  }
  if (Validator.isEmpty(data.name)) {
    errors.name = '名字不能为空'
  }
  if (Validator.isEmpty(data.stuId)) {
    errors.stuId = '学号不能为空'
  }
  if (!Validator.isMobilePhone(data.phone)) {
    errors.phone = '手机号不合法'
  }
  if (Validator.isEmpty(data.phone)) {
    errors.phone = '手机号不能为空'
  }
  if (!Validator.isEmail(data.email)) {
    errors.email = '邮箱不合法'
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = '邮箱不能为空'
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