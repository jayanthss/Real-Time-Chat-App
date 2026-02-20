import React from 'react'
import { BaseButton } from './BaseButton'

function PrimaryButton({className = "",...props}) {
  const basestyle = `${className}`
  return (
      <BaseButton className={basestyle} {...props} />
  )
}

export default PrimaryButton
