import React from 'react'
import "./SpecsListItem.css"

interface Props {
    label: string
    value?: string
}

const SpecsListItem = ({ label, value }: Props) => {
  return (
    <div className='specs-list-item'>
        <div className='specs-list-item-label'>{label}</div>
        <div className='specs-list-item-value'>{value}</div>
    </div>
  )
}

export default SpecsListItem