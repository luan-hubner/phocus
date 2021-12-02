const { isValid } = require('../models/validator')

async function validator (file) {
  return isValid(file)
}

module.exports = {
  validator
}