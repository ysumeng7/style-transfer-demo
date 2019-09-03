import React from 'react'
import StyleIcon from './style-icon'
import images from '../assets/style-images'
import './style-panel.css'


export default class StylePanel extends React.Component {
  constructor(props) {
    super(props)
    this.buildStyleIcon = this.buildStyleIcon.bind(this)
  }

  buildStyleIcon() {
    return images.map((img, id) => <StyleIcon
      key={id}
      index={id}
      image={img}
      onClick={this.props.onClick}
    />)
  }

  render() {
    return (
      <div className='panel'>
        {this.buildStyleIcon()}
      </div>
    )
  }
}