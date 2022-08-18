import React from 'react'
import { observer } from 'mobx-react'
import { isEmpty, isFunction, get } from 'lodash'

import { Button, Menu, Icon, Dropdown } from '@kube-design/components'

function withTableActions(WrappedComponent) {
  class TableWrapper extends React.Component {
    static defaultProps = {
      itemActions: [],
      tableActions: {},
    }

    get enabledItemActions() {
      const { itemActions } = this.props
      return itemActions
    }

    getEnabledTableActions() {
      const { tableActions, ...rest } = this.props;

      Object.assign(tableActions, rest)

      if (tableActions.actions) {
        tableActions.actions = tableActions.actions.filter(
          item =>
            !item.action ||
            (typeof item.filter === 'function' &&
              item.filter.call(this, item))
        )
      }

      if (isEmpty(tableActions.selectActions)) {
        tableActions.onSelectRowKeys = null
      }

      return tableActions
    }

    getColumns = () => {
      const { columns } = this.props
      return [
        ...columns,
        {
          key: 'more',
          width: 20,
          render: this.renderMore,
        },
      ]
    }

    handleMoreMenuClick = item => (e, key) => {
      const action = this.enabledItemActions.find(
        _action => _action.key === key
      )
      if (action && action.onClick) {
        action.onClick(item)
      }
    }

    renderMore = (field, record) => {
      if (isEmpty(this.enabledItemActions)) {
        return null
      }

      const content = this.renderMoreMenu(record)

      if (content === null) {
        return null
      }

      return (
        <Dropdown content={content} trigger="click" placement="bottomRight">
          <Button icon="more" type="flat" />
        </Dropdown>
      )
    }

    renderMoreMenu = record => {
      const items = this.enabledItemActions.map(action => {
        const show = isFunction(action.show)
          ? action.show(record)
          : action.show || true

        const icon = isFunction(action.icon) ? action.icon(record) : action.icon
        const text = isFunction(action.text) ? action.text(record) : action.text

        const disabled = get(action, 'disabled', undefined)

        if (!show) return null

        return (
          <Menu.MenuItem
            key={action.key}
            disabled={isFunction(disabled) ? disabled(record) : false}
          >
            <Icon name={icon} />{' '}
            <span data-test={`table-item-${action.key}`}>{text}</span>
          </Menu.MenuItem>
        )
      })

      if (items.every(item => item === null)) {
        return null
      }

      return <Menu onClick={this.handleMoreMenuClick(record)}>{items}</Menu>
    }

    render() {
      return (
        <WrappedComponent
          {...this.getEnabledTableActions()}
          columns={this.getColumns()}
        />
      )
    }
  }

  return observer(TableWrapper)
}

export default withTableActions
