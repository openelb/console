import { get, set } from 'lodash'
import { action, observable, makeObservable } from 'mobx'
import ObjectMapper from '../utils/object.mapper'

import { LIST_DEFAULT_ORDER, API_VERSIONS } from '../utils/constants'

import List from './base.list'

class BaseStore {
  list = new List()

  detail = {}

  isLoading = true

  isSubmitting = false

  constructor(module) {
    makeObservable(this, {
      detail: observable,
      isLoading: observable,
      isSubmitting: observable,
      submitting: action,
      setModule: action,
      fetchList: action,
      fetchListByK8s: action,
      fetchDetail: action,
      setSelectRowKeys: action,
      create: action,
      update: action,
      patch: action,
      delete: action,
      batchDelete: action,
      checkName: action,
    })
    this.module = module
  }

  get apiVersion() {
    return API_VERSIONS[this.module] || ''
  }

  get mapper() {
    return ObjectMapper[this.module.toUpperCase()] || (data => data)
  }

  getListUrl = (params = {}) =>
    `${this.apiVersion}/${this.module}${params.dryRun ? '?dryRun=All' : ''
    }`

  getDetailUrl = (params = {}) => `${this.getListUrl(params)}/${params.name}`

  getResourceUrl = () => `${this.module}`

  getFilterParams = params => {
    const result = { ...params }
    if (result.app) {
      result.labelSelector = result.labelSelector || ''
      result.labelSelector += `app.kubernetes.io/name=${result.app}`
      delete result.app
    }
    return result
  }


  setModule(module) {
    this.module = module
  }

  submitting(promise) {
    this.isSubmitting = true

    setTimeout(() => {
      promise
        .catch(() => { })
        .finally(() => {
          this.isSubmitting = false
        })
    }, 500)

    return promise
  }

  async fetchList({
    cluster,
    workspace,
    namespace,
    more,
    devops,
    ...params
  } = {}) {
    this.list.isLoading = true

    if (!params.sortBy && params.ascending === undefined) {
      params.sortBy = LIST_DEFAULT_ORDER[this.module] || 'createTime'
    }

    if (params.limit === Infinity || params.limit === -1) {
      params.limit = -1
      params.page = 1
    }

    params.limit = params.limit || 10

    const result = await request.get(
      this.getResourceUrl(),
      this.getFilterParams(params)
    )
    const data = (get(result, 'items') || []).map(item => ({
      ...this.mapper(item),
    }))

    this.list.update({
      data: more ? [...this.list.data, ...data] : data,
      total: result.totalItems || result.total_count || data.length || 0,
      ...params,
      limit: Number(params.limit) || 10,
      page: Number(params.page) || 1,
      isLoading: false,
      ...(this.list.silent ? {} : { selectedRowKeys: [] }),
    })

    return data
  }


  async fetchListByK8s({ cluster, namespace, module, ...rest } = {}) {
    this.list.isLoading = true

    if (module) {
      this.module = module
    }

    const params = rest

    const result = await request.get(
      this.getListUrl({ cluster, namespace, module }),
      params,
      {},
      () => {
        return { items: [] }
      }
    )

    const data = Array.isArray(result.items)
      ? result.items.map(item => ({
        cluster,
        module: module || this.module,
        ...this.mapper(item),
      }))
      : []

    this.list.update({
      data,
      total: result.items.length || 0,
      isLoading: false,
    })

    return data
  }

  async fetchDetail(params) {
    this.isLoading = true

    const result = await request.get(this.getDetailUrl(params))
    const detail = { ...params, ...this.mapper(result) }

    this.detail = detail
    this.isLoading = false
    return detail
  }

  setSelectRowKeys(selectedRowKeys) {
    this.list.selectedRowKeys.replace(selectedRowKeys)
  }

  create(data, params = {}) {
    return this.submitting(request.post(this.getListUrl(params), data))
  }

  async update(params, newObject) {
    const result = await request.get(this.getDetailUrl(params))
    const resourceVersion = get(result, 'metadata.resourceVersion')
    if (resourceVersion) {
      set(newObject, 'metadata.resourceVersion', resourceVersion)
    }
    return this.submitting(request.put(this.getDetailUrl(params), newObject))
  }

  async patch(params, newObject) {
    return this.submitting(request.patch(this.getDetailUrl(params), newObject))
  }

  delete(params) {
    return this.submitting(request.delete(this.getDetailUrl(params)))
  }

  batchDelete(rowKeys) {
    return this.submitting(
      Promise.all(
        rowKeys.map(name => {
          const item = this.list.data.find(_item => _item.name === name)
          return request.delete(this.getDetailUrl(item))
        })
      )
    )
  }

  checkName(params, query) {
    return request.get(
      this.getDetailUrl(params),
      { ...query },
      {
        headers: { 'x-check-exist': true },
      }
    )
  }
}

export default BaseStore