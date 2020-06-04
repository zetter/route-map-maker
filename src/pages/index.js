import React, {useEffect, useRef, useState} from 'react'
import Layout from '../components/layout'
import SEO from '../components/seo'
import RouteMapMaker from '../js/routeMapMaker'

const IndexPage = () => {
  const canvas = useRef(null);

  const [imageURL, setImageURL] = useState()

  const mapRendered = () => { setImageURL(canvas.current.toDataURL("image/png"))}

  useEffect(() => {
    let routeMapMaker = new RouteMapMaker(canvas.current);
    routeMapMaker.start(mapRendered);
  }, [])

  return <Layout>
    <SEO title="Route Map Maker" />
    {(imageURL ?
      <>
        <style dangerouslySetInnerHTML={{__html: `
            .rendered-map { background-image: url(${imageURL})}
        `}} />
        <div className='.rendered-map' style={{width: '500px', height: '500px'}}></div>
      </>
    :
      <canvas ref={canvas} id="output" width="750px" height="750px"/>
    )}
  </Layout>
}

export default IndexPage
