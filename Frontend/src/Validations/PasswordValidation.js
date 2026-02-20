export const PasswordValidate =(password)=>{
  if(!password.trim()){
    return {message:"Password is Required",status:false}
  }

  if(password.length < 6){
    return {message:"Password Must Be Atleast 6 Character",status:false}
  }

  if(!/[A-Z]/.test(password)) return {message:"Must Start with upper case",status:false}
  if(!/[a-z]/.test(password)) return {message:"Must inculde lower case",status:false}
  if(!/[0-9]/.test(password)) return {message:"Must inculde at least one number",status:false}
  if(!/[@$%#*&!]/.test(password)) return {message:"Must inculde a Symbol (@$%#*&!)",status:false}

  return {message:"",status:true}
}