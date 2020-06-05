import React, {useEffect, useRef, useState} from 'react'
import Layout from '../components/layout'
import SEO from '../components/seo'
import RouteMapMaker from '../js/routeMapMaker'
import DraggableMap from '../components/draggableMap'
import Settings from '../components/settings'

const IndexPage = () => {
  const canvas = useRef(null);
  const tileSize = 50
  const [size, setSize] = useState({x: 10, y: 10})
  const [imageURL, setImageURL] = useState()
  const [generating, setGenerating] = useState(true)
  const [tab, setTab] = useState(null)
  const width = size.x * tileSize
  const height = size.y * tileSize

  const mapRendered = () => {
    setImageURL(canvas.current.toDataURL("image/png"))
    setGenerating(false)
  }

  const updateSettings = ({size: newSize}) => {
    setSize(newSize)
  }

  const generate = () => {
    setTab(null)
    setGenerating(true)
    setImageURL(null)
    let routeMapMaker = new RouteMapMaker({canvas: canvas.current, ...size, tileSize});
    routeMapMaker.start(mapRendered);
  }

  useEffect(generate, [size])

  return <Layout>
    <div className="header">
      <h1>
        BSicon Map Generator
      </h1>
      {(generating ? <em>Generating</em> :
        <nav>
          <a onClick={generate}>Regenerate</a>
          <a onClick={() => setTab('settings')}>Settings</a>
          <a onClick={() => setTab('about')}>About</a>
        </nav>
      )}
      <Settings show={tab === 'settings'} initialX={size.x} initialY={size.y} onSubmit={updateSettings}/>
      {(tab === 'about') &&
        <div>
          <h3>About</h3>
        </div>
      }
    </div>
    <SEO title="Route Map Maker" />
    <div className="canvas-wrapper">
      <canvas ref={canvas} width={`${width}px`} height={`${height}px`} />
    </div>
    {(imageURL &&
      <>
        <style dangerouslySetInnerHTML={{__html: `
            .rendered-map {
              background-image: url(${imageURL});
              background-size: ${width}px;
            }
            @media (min-resolution: 2dppx) {
              .rendered-map {
                background-size: ${(width)/2}px;
              }
            }
        `}} />
        <DraggableMap/>
      </>
    )}
  </Layout>
}

export default IndexPage
