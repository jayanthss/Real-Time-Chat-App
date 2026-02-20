const EmailValidation = (email)=>{
  if(!email.trim()){
    return {message:"Email is Required.",status:false,errorFrom:"email"}
  }
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if(!regex.test(email)){
    return  {message:"Invaild Email Format",status:false,errorFrom:"email"}
  }

  return {message:"",status:true,errorFrom:"email"}
}

export default EmailValidation