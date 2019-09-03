import React from 'react'
import MagicDropzone from 'react-magic-dropzone'
import './image-pane.css'


export default function ImagePane(props) {
  return ( 
    <MagicDropzone
      className='image-pane'
      accept='image/jpeg, image/png, .jpg, .jpeg, .png'
      multiple={false}
      onDrop={(accept, _, link) => props.onDrop(accept[0].preview || link[0])}
    >
      <img
        src={props.image}
        alt='drop-zone'
      />
    </MagicDropzone>
  )
}