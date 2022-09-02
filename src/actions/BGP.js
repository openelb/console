import Modal from "../components/Base/Modal"
import createModal from "../components/Modal/Create"
import createBgpConfModel from "../components/Modal/BgpConfCreate"
import CommonAction from "./base"
import steps from "../steps/bgppeer"
import FORM_TEMPLATES from "../utils/form.templates"

const Actions = {
  ...CommonAction,
  "bgp.create": {
    on({ store }) {
      const formTemplate = FORM_TEMPLATES['bgp']()
      const modal = Modal.open({
        onOk: (formData) => {
          // TODO
          // need to implement the create action in eip Store
        },
        modal: createModal,
        steps,
        name: 'BgpPeer',
        formTemplate,
        store,
        okBtnText: 'create',
      })
    }
  },
  "bgp.editInfo": {
    on() {
      console.log('bgp editInfo')
    }
  },
  "bgpconf.create": {
    on({ store }) {
      const formTemplate = FORM_TEMPLATES['bgpconf']()
      const modal = Modal.open({
        onOk: (formData) => {
          // TODO
          // need to implement the create action in eip Store
        },
        modal: createBgpConfModel,
        name: 'BgpConf',
        formTemplate,
        store,
        okBtnText: 'create',
      })
    }
  },
}

export default Actions