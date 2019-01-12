import React from 'react'
import Layout from '../components/layout'
import SEO from '../components/seo'
import RouteMapMaker from '../js/routeMapMaker'

class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.canvas = React.createRef();
  }

  render() {
    return <Layout>
      <SEO title="Route Map Maker" />
      <canvas ref={this.canvas} id="output" width="750px" height="750px"/>
    </Layout>
  }

  componentDidMount() {
   let routeMapMaker = new RouteMapMaker(this.canvas.current);
   routeMapMaker.start();
 }
}

export default IndexPage
