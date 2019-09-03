import React from 'react'
import axios from 'axios'
import ImagePane from './image-pane'
import StylePanel from './style-panel'
import resizeImage from '../utils'
import drop from '../assets/drop.png'


export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cache: {},
      image: null,
      style: null,
    }
    this.timer = null
    this.onSelectStyle = this.onSelectStyle.bind(this)
    this.onUploadImage = this.onUploadImage.bind(this)
  }

  async styleTransfer() {
    const x = await resizeImage(this.state.cache[0])
    const z = this.state.style

    if (!z) {
      return this.state.cache[0]
    } else if (z && this.state.cache[z]) {
      return this.state.cache[z]
    } else if (x && z) {
      try {
        const url  = '/api/style-transfer'
        const data = {
          image: x,
          style: z
        }
        const resp = await axios.post(url, data)
        return resp.data['style-image']
      } catch (error) {
        console.log(error)
        return x
      }
    } else {
      return this.state.cache[0]
    }
  }

  onSelectStyle(index) {
    clearTimeout(this.timer)
    this.setState({style: index})
    this.timer = setTimeout(() => {
      this.styleTransfer().then(image => {
        this.setState({image: image})
        if (index > 0) {
          const cache = Object.assign({}, this.state.cache)
          cache[index] = image
          this.setState({cache: cache})
        }
      })
    }, 500)
  }

  onUploadImage(image) {
    this.setState({image: image})
    this.setState({cache: {0: image}})
  }

  render() {
    return (
      <div>
        <ImagePane onDrop={this.onUploadImage} image={this.state.image || drop} />
        <StylePanel onClick={this.onSelectStyle} />
      </div>
    )
  }
}