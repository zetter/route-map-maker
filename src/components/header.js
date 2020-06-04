import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'

const Header = ({ siteTitle }) => (
  <div
    style={{
      background: `#BE2D2C`,
      position: 'absolute',
      zIndex: 100,
    }}
  >
    <h1 style={{ margin: '10px', color: `white`, }}>
      BSicon Map Generator
    </h1>
  </div>
)

Header.propTypes = {
  siteTitle: PropTypes.string,
}

Header.defaultProps = {
  siteTitle: ``,
}

export default Header
