import { renderRoutes } from '../../utils/router.config'
import routes from './routes'
import actions from '../../actions/BGP'
import {inject} from 'mobx-react'

const BGP = ({ rootStore }) => {
  rootStore.resetAction()
  rootStore.registerActions(actions)
  return renderRoutes(routes)
}

export default inject("rootStore")(BGP)