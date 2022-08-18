import React, { Component } from 'react'
import Header from './Header'
import styles from './index.module.scss'
import { renderRoutes } from '../utils/router.config'

class Layout extends Component {
  constructor(props) {
    super(props)
    this.routes = props.route.routes
  }

  render() {
    return (
      <>
        <Header {...this.props} />
        <div className={styles.main}>{renderRoutes(this.routes)}</div>
      </>
    )
  }

}

export default Layout