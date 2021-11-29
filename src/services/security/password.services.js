const bcrypt = require('bcryptjs')

exports.hashPassword = async password => {
  const salt = await bcrypt.genSalt(12)
  const hashedPassword = await bcrypt.hash(password, salt)
  return hashedPassword
}

exports.validatePassword = async (password, hashedPassword) => {
  const isValid = await bcrypt.compare(password, hashedPassword)
  return isValid
}
