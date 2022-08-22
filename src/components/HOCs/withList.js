import React from 'react'
import { toJS } from 'mobx'
import { observer, inject } from 'mobx-react'
import { isEmpty, isEqual } from 'lodash'
import { parse } from 'qs'

import { trigger } from '../../utils/action'

export default function withList(options) {
  return WrappedComponent => {
    const ObserverComponent = observer(WrappedComponent)
    class ListWrapper extends React.Component {
      constructor(props) {
        super(props)
        this.store = options.store || {}
        this.list = this.store.list || {}
        this.module = options.module || ''
        this.name = options.name || ''
        this.title = `${options.name}_PL`
        this.rowKey = options.rowKey || 'name'
        this.query = {}
      }

      get routing() {
        return this.props.rootStore.routing
      }

      get prefix() {
        return this.props.match.url
      }

      get defaultItemActions() {
        return [
          {
            key: 'edit',
            icon: 'pen',
            text: 'Edit information',
            action: 'edit',
            onClick: item =>
              this.trigger('resource.baseinfo.edit', {
                detail: item,
                success: this.routing.query,
              }),
          },
          {
            key: 'delete',
            icon: 'trash',
            text: 'Delete',
            action: 'delete',
            onClick: item =>
              this.trigger('resource.delete', {
                type: this.name,
                resource: item.name,
                detail: item,
                success: this.routing.query,
              }),
          },
        ]
      }

      get defaultTableActions() {
        return {
          onFetch: this.routing.query,
          onSelectRowKeys: this.list.setSelectRowKeys,
          selectActions: [
            {
              key: 'delete',
              type: 'danger',
              text: 'Delete',
              action: 'delete',
              onClick: () =>
                this.trigger('resource.batch.delete', {
                  type: this.name,
                  rowKey: this.rowKey,
                  success: this.routing.query,
                }),
            },
          ],
        }
      }

      getData = async ({ silent, ...params } = {}) => {
        this.query = params

        silent && (this.list.silent = true)
        const paramsObj = {
          ...this.props.match.params,
          ...params,
        }

        await this.store.fetchList(paramsObj)
        this.list.silent = false
      }

      getTableProps() {
        const {
          data,
          filters = {},
          keyword,
          selectedRowKeys,
          isLoading,
          total,
          page,
          limit,
          silent,
        } = this.list

        const pagination = { total, page, limit }

        const isEmptyList =
          isLoading === false &&
          total === 0 &&
          Object.keys(filters).length <= 0 &&
          isEmpty(keyword)

        return {
          data,
          filters,
          keyword,
          pagination,
          isLoading,
          selectedRowKeys: toJS(selectedRowKeys),
          silentLoading: silent,
          isEmptyList,
          rowKey: this.rowKey,
          module: this.module,
          name: this.name,
          itemActions: this.defaultItemActions,
          tableActions: this.defaultTableActions,
          tableId: this.props.match.path,
        }
      }

      getSortOrder = dataIndex =>
        this.list.order === dataIndex &&
        (this.list.reverse ? 'descend' : 'ascend')

      getFilteredValue = dataIndex => this.list.filters[dataIndex]

      render() {
        return (
          <ObserverComponent
            name={this.name}
            module={this.module}
            store={this.store}
            prefix={this.prefix}
            routing={this.routing}
            query={this.query}
            tableProps={this.getTableProps()}
            getSortOrder={this.getSortOrder}
            getFilteredValue={this.getFilteredValue}
            trigger={this.trigger.bind(this)}
            getData={this.getData}
            {...this.props}
          />
        )
      }
    }

    const injectStores = options.injectStores || ['rootStore']

    return inject(...injectStores)(observer(trigger(ListWrapper)))
  }
}

export class ListPage extends React.Component {
  get store() {
    return this.props.store
  }

  get websocket() {
    return this.props.rootStore.websocket
  }

  get routing() {
    return this.props.rootStore.routing
  }

  componentDidMount() {
    this.routing.history.subscribe((location) => {
      if (location.pathname === this.props.match.url) {
        const params = parse(location.search.slice(1))
        this.query = params || {}
        this.props.getData(params)
      }
    })
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.match.params, this.props.match.params)) {
      this.props.getData()
    }
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe()
  }

  render() {
    return this.props.children
  }
}