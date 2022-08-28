import BaseInfo from "../components/Forms/EIP/BaseInfo"
import EipSettings from "../components/Forms/EIP/Settings"

const steps = [
  {
    title: 'Basic Information',
    component: BaseInfo,
    required: true,
    icon: 'cdn',
  },
  {
    title: 'EipSetting',
    component: EipSettings,
    required: true,
    icon: 'eip-duotone',
  },
]

export default steps