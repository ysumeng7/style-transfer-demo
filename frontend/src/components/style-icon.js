import React from 'react'
import './style-icon.css'


export default function StyleIcon(props) {
  return ( 
    <div className='image-icon'>
      <img
        onClick={() => props.onClick(props.index)}
        src={props.image}
        alt={`Style Index: ${props.index}`}
      />
    </div>
  )
}