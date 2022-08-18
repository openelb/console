import {
  get,
  omit,
} from 'lodash'

import {
  getDescription,
  getAliasName,
  getResourceCreator,
} from '../utils'

const getOriginData = item =>
  omit(item, [
    'status',
    'metadata.uid',
    'metadata.selfLink',
    'metadata.generation',
    'metadata.ownerReferences',
    'metadata.resourceVersion',
    'metadata.creationTimestamp',
    'metadata.managedFields',
  ])

const getBaseInfo = item => ({
  uid: get(item, 'metadata.uid'),
  name: get(item, 'metadata.name'),
  creator: getResourceCreator(item),
  description: getDescription(item),
  aliasName: getAliasName(item),
  createTime: get(item, 'metadata.creationTimestamp', ''),
  resourceVersion: get(item, 'metadata.resourceVersion'),
  isFedManaged: get(item, 'metadata.labels["kubefed.io/managed"]') === 'true',
})

const BGPMapper = item => ({
  ...getBaseInfo(item),
  _originData: getOriginData(item),
})

const EIPMapper = item => ({
  ...getBaseInfo(item),
  disable: get(item, 'spec.disable', false),
  address: get(item, 'spec.address', ""),
  protocol: get(item, 'spec.protocol', ""),
  poolSize: get(item, 'status.poolSize', 0),
  usage: get(item, 'status.usage', 0),
  _originData: getOriginData(item),
})

const Mappers = {
  BGP: BGPMapper,
  EIP: EIPMapper,
}

export default Mappers