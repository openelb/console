import React, { Component } from 'react'
import { Router } from 'react-router'
import { createBrowserHistory } from 'history'
import { syncHistoryWithStore } from 'mobx-react-router'
import { Provider } from 'mobx-react'

import routes from './routes';
import RootStore from './stores/root';
import { renderRoutes } from './utils/router.config'

import '@kube-design/components/esm/styles/index.scss'
import './scss/main.scss'

class App extends Component {
  constructor(props) {
    super(props)
    this.rootStore = new RootStore()
    this.history = syncHistoryWithStore(
      createBrowserHistory(),
      this.rootStore.routing
    )
  }

  render() {
    return (
      <Provider rootStore={this.rootStore} >
        <Router history={this.history}> {renderRoutes(routes)}</Router >
      </Provider>
    )
  }
}

export default App
