import React from 'react'
import axios from 'axios'
import ImagePane from './image-pane'
import StylePanel from './style-panel'
import resizeImage from '../utils'
import drop from '../assets/drop.png'
import loading from '../assets/loading.gif'


export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cache: {},
      image: null,
    }
    this.timer = null
    this.onSelectStyle = this.onSelectStyle.bind(this)
    this.onUploadImage = this.onUploadImage.bind(this)
  }

  async sendImage(image) {
    try {
      const url  = '/api/style-transfer'
      const data = {image: await resizeImage(image)}
      const resp = await axios.put(url, data)
      return resp.data
    } catch (error) {
      console.log(error)
      return 'error in sending image'
    }
  }

  async getStyleImage(z) {
    try {
      const url  = '/api/style-transfer'
      const data = { style: z }
      const resp = await axios.post(url, data)
      return resp.data['style-image']
    } catch (error) {
      console.log(error)
      return this.state.cache[0]
    }
  }

  setImage(index) {
    clearTimeout(this.timer)
    const image = this.state.cache[index]
    if (image)
      this.setState({image: image}) 
    else
      this.timer = setTimeout(() => this.setImage(index), 500)
  }

  onSelectStyle(index) {
    this.setState({image: loading})
    this.setImage(index)
  }

  onUploadImage(image) {
    this.setState({image: image})
    this.setState({cache: {0: image}})
    this.sendImage(image).then(
      mssg => {
        console.log(mssg)
        for (let z = 0; z < 10; z++) {
          this.getStyleImage(z).then(image => {
            const cache = Object.assign({}, this.state.cache)
            cache[z + 1] = image
            this.setState({cache: cache})
            console.log(`Style-${z} [done]`)
          })
        }
      }
    )
  }

  render() {
    return (
      <div>
        <ImagePane onDrop={this.onUploadImage} image={this.state.image || drop} />
        <StylePanel onClick={this.onSelectStyle} ready={[...Array(11).keys()].map(i => this.state.cache[i])}/>
      </div>
    )
  }
}