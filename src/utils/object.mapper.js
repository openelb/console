import {
  get,
  omit,
  size,
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

const BGPMapper = item => {
  const nodeField = Object.keys(item?.status.nodesPeerStatus)[0]
  return ({
    ...getBaseInfo(item),
    status: get(item,
      `status.nodesPeerStatus?.${nodeField}.peerState.sessionState`, ""),
    localAs: get(item,
      `status.nodesPeerStatus?.${nodeField}.peerState.localAS`, "-"),
    peerAs: get(item, 'spec.conf.peerAs', ""),
    neighborAddress: get(item,
      `status.nodesPeerStatus?.${nodeField}.peerState.neighborAddress`, ""),
    peerType: get(item,
      `status.nodesPeerStatus?.${nodeField}.peerState.peerType`, 0),
    sendMax: get(item, 'spec.afiSafis[0].addPaths.config.sendMax', "-"),
    bgpPeerLeaf: get(item,
      'spec.nodeSelector.matchLabels["openelb.kubesphere.io/rack"]', "-"),
    description: get(item,
      `status.nodesPeerStatus?.${nodeField}.peerState.description`, ""),
    _originData: getOriginData(item),
  })
}

const BGPConfMapper = item => ({
  ...getBaseInfo(item),
  as: get(item, 'spec.as', ""),
  listenPort: get(item, 'spec.listenPort', "-"),
  routerID: get(item, 'spec.routerId', ""),
  nodeCount: size(item.status.nodesConfStatus, 0),
  nodes: Object.keys(item.status.nodesConfStatus),
  _originData: getOriginData(item),
})

const EIPMapper = item => ({
  ...getBaseInfo(item),
  disable: get(item, 'spec.disable', false),
  address: get(item, 'spec.address', ""),
  protocol: get(item, 'spec.protocol', "bgp"),
  poolSize: get(item, 'status.poolSize', 0),
  usage: get(item, 'status.usage', 0),
  interface: get(item, 'spec.interface', ""),
  default: get(item,
    'metadata.annotations["eip.openelb.kubesphere.io/is-default-eip"]', ""),
  firstIP: get(item, 'status.firstIP', ""),
  lastIP: get(item, 'status.lastIP', ""),
  addressFamily: get(item, 'spec.addressFamily', "IPv4"),
  occupied: get(item, 'status.occupied', false),
  ready: get(item, 'status.ready', false),
  used: get(item, 'status.used', []),
  _originData: getOriginData(item),
})

const Mappers = {
  BGP: BGPMapper,
  BGPCONF: BGPConfMapper,
  EIP: EIPMapper,
}

export default Mappers