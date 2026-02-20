import EmailValidation from "./EmailValidation"
import { PasswordValidate } from "./PasswordValidation"

export const ValidationSingup = 
({
  username,
  email,
  password,
  confirmPassword
})=>{
  let error= {}
  if(!username.trim()){
    error.username = "Name is required"
  }
  if(username.length < 4){
    error.username = "Name Is Atleast 4 Character"
  }
  const emailError = EmailValidation(email)
  if(!emailError.status){
    error.email = emailError.message
  }

  const passwordError = PasswordValidate(password)

  if(!passwordError.status){
    error.password = passwordError.message
  }

  if(!confirmPassword.trim()){
    error.confirmPassword = "Confirm Password is Required"
  }

  if(confirmPassword !== password){
    error.confirmPassword = "Password not match"
  }

  return error
}

export const ValidateLogin = ({username,password})=>{
  let errors = {}

  if(!username.trim()){
    errors.username = "Username is required."
  }

  if(!password.trim()){
    errors.password = "Password is Required."
  }

  return errors
}