import React from 'react'

function IconButton({className = "",Icon,Icon_Style,user_input = "",iconName,...props}) {           
  let baseStyle = `${className}${user_input && "bg-[#6b4beb]"}`

  return (
    <button className = {baseStyle} {...props}>
      <Icon className={Icon_Style} />
    </button>

  )
}

export default IconButton