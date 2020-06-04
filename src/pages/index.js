import React from 'react'
import Layout from '../components/layout'
import SEO from '../components/seo'
import RouteMapMaker from '../js/routeMapMaker'

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
    this.mapRendered = this.mapRendered.bind(this)
    this.state = {}
  }

  render() {
    return <Layout>
      <SEO title="Route Map Maker" />
      {(this.state.imageURL ?
        <>
          <style dangerouslySetInnerHTML={{__html: `
              .styled { background-image: url(${this.state.imageURL})}
          `}} />
          <div className='styled' style={{width: '500px', height: '500px'}}></div>
        </>
      :
        <canvas ref={this.canvas} id="output" width="750px" height="750px"/>
      )}
    </Layout>
  }

  componentDidMount() {
   let routeMapMaker = new RouteMapMaker(this.canvas.current);
   routeMapMaker.start(this.mapRendered);
  }

  mapRendered() {
    this.setState({imageURL: this.canvas.current.toDataURL("image/png")})
  }

}

export default IndexPage
