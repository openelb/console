import { action, observable, extendObservable, makeObservable } from 'mobx'
import { RouterStore } from 'mobx-react-router'
import { parse } from 'qs'
import { getQueryString } from '../utils'

export default class RootStore {
  actions = observable({})

  constructor() {
    makeObservable(this, {
      registerActions: action,
      triggerAction: action,
    })
    this.routing = new RouterStore()
    this.routing.query = this.query

    makeObservable(this.routing)
    global.navigateTo = this.routing.push
  }

  register(name, store) {
    extendObservable(this, { [name]: store })
  }

  query = (params = {}, refresh = false) => {
    const { pathname, search } = this.routing.location
    const currentParams = parse(search.slice(1))

    const newParams = refresh ? params : { ...currentParams, ...params }

    this.routing.push(`${pathname}?${getQueryString(newParams)}`)
  }

  registerActions = (actions) => {
    extendObservable(this.actions, actions)
  }

  resetAction = () => {
    this.actions = {}
  }

  triggerAction = (id, ...rest) => {
    this.actions[id] && this.actions[id].on(...rest)
  }
}