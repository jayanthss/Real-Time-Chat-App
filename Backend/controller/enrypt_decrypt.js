import crypto from 'crypto'

const key = process.env.secret_key;
const algorithum = 'aes-256-cbc'

function encrypt(message){
  const iv = crypto.randomBytes(16)

  let cipher = crypto.createCipheriv(algorithum,Buffer.from(key,'hex'),iv)

  let encrypted = cipher.update(message)
  encrypted = Buffer.concat([
    encrypted,
    cipher.final()
  ])

  return {
    iv:iv.toString('hex'),
    encrypted_message:encrypted.toString('hex')
  }
}

function decrypt(encrypted_data,iv_){

  const iv = Buffer.from(iv_,'hex')
  const encrypted_msg = Buffer.from(encrypted_data,"hex")

  let dicipher = crypto.createDecipheriv(algorithum,Buffer.from(key,'hex'),iv)

  let decrypted = dicipher.update(encrypted_msg)

  decrypted = Buffer.concat([
    decrypted,dicipher.final()
  ])

  return {
    decrypted_message:decrypted.toString()
  }
}

export {encrypt,decrypt}
