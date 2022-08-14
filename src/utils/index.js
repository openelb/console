import { get } from "lodash"

export const getDescription = item =>
  get(item, 'metadata.annotations["kubesphere.io/description"]') ||
  get(item, 'metadata.annotations.desc') ||
  ''

export const getAliasName = item =>
  get(item, 'metadata.annotations["kubesphere.io/alias-name"]') ||
  get(item, 'metadata.annotations.displayName') ||
  ''
export const getResourceCreator = item =>
  get(item, 'metadata.annotations["kubesphere.io/creator"]') ||
  get(item, 'metadata.annotations.creator') ||
  ''
export const getClusterUrl = url => {
  let requestURL = url

  const reg = new RegExp(/\/(api|apis|kapis)\/(.*)\/?(klusters\/[^/]*)\/(.*)/)
  const match = requestURL.match(reg)

  if (match && match.length === 5) {
    requestURL = globals.app.isMultiCluster
      ? `/${match[1]}/${match[3].replace('klusters', 'clusters')}/${match[2]}/${match[4]
      }`
      : `/${match[1]}/${match[2]}/${match[4]}`
  }

  return requestURL.replace(/\/\/+/, '/')
}

export const getQueryString = (params, hasEncode = true) =>
  Object.keys(params)
    .filter(key => params[key])
    .map(
      key =>
        `${key}=${hasEncode ? encodeURIComponent(params[key]) : params[key]}`
    )
    .join('&')

export const safeParseJSON = (json, defaultValue) => {
  let result
  try {
    result = JSON.parse(json)
  } catch (e) { }

  if (!result && defaultValue !== undefined) {
    return defaultValue
  }
  return result
}
