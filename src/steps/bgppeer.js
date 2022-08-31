import BaseInfo from "../components/Forms/BGPPeer/BaseInfo"
import BgpPeerSettings from "../components/Forms/BGPPeer/Settings"

const steps = [
  {
    title: 'Basic Information',
    component: BaseInfo,
    required: true,
    icon: 'cdn',
  },
  {
    title: 'BgpPeer Setting',
    component: BgpPeerSettings,
    required: true,
    icon: 'conversion-node',
  },
]

export default steps