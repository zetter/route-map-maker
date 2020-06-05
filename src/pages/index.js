import React, {useEffect, useRef, useState} from 'react'
import Layout from '../components/layout'
import SEO from '../components/seo'
import RouteMapMaker from '../js/routeMapMaker'
import DraggableMap from '../components/DraggableMap'

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
    <canvas className="canvas" ref={canvas} width="750px" height="750px"/>
    {(imageURL &&
      <>
        <style dangerouslySetInnerHTML={{__html: `
            .rendered-map { background-image: url(${imageURL})}
        `}} />
        <DraggableMap/>
      </>
    )}
  </Layout>
}

export default IndexPage
