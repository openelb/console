import { get } from 'lodash'

export const trigger = function(WrappedComponent) {
  WrappedComponent.prototype.trigger = function(actionId, options = {}) {
    const rootStore = get(this, 'props.rootStore')
    if (rootStore) {
      rootStore.triggerAction(actionId, { store: this.store, ...options })
    }
  }
  return WrappedComponent
}
