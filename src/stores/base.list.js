import { action, observable, makeObservable } from 'mobx'

export default class List {
  constructor() {
    makeObservable(this, {
      data: observable,
      total: observable,
      isLoading: observable,
      selectedRowKeys: observable,
      update: action,
      updateItem: action,
      setSelectRowKeys: action,
    })
  }

  data = []

  page = 1

  limit = 10

  total = 0

  sortBy = ''

  ascending = false

  silent = false

  filters = {}

  isLoading = true

  selectedRowKeys = []

  update = (params) => {
    this.filters = {}
    Object.keys(params).forEach(key => {
      if (Object.prototype.hasOwnProperty.call(this, key)) {
        this[key] = params[key]
      } else if (params[key]) {
        this.filters[key] = params[key]
      }
    })
  }

  updateItem = (item) => {
    if (item.uid) {
      const index = this.data.findIndex(_item => _item.uid === item.uid)
      if (index >= 0) {
        this.data[index] = item
        this.data = [...this.data]
      }
    }
  }

  reset() {
    this.data = []
    this.page = 1
    this.limit = 10
    this.sortBy = ''
    this.ascending = false
    this.silent = false
    this.filters = {}
    this.isLoading = true
    this.selectedRowKeys = []
  }

  setSelectRowKeys = (rowKeys) => {
    this.selectedRowKeys = rowKeys
  }
}
