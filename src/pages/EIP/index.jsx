import { renderRoutes } from '../../utils/router.config'
import routes from './routes'
import actions from '../../actions/eip'
import {inject} from 'mobx-react'

const EIP = ({ rootStore }) => {
  rootStore.resetAction()
  rootStore.registerActions(actions)
  return renderRoutes(routes)
}

export default inject("rootStore")(EIP)