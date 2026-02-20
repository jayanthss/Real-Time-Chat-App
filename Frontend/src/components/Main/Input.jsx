import React from 'react'

export default function Input({type,...props}) {
  return (
    <>
    <input type={type} {...props}/>
    </>
  )
}   
