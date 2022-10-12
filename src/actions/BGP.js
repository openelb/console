import { Notify } from '@kube-design/components'
import Modal from "../components/Base/Modal"
import CreateModal from "../components/Modal/Create"
import EditSettingsModal from "../components/Modal/EditSettings"
import CreateBgpConfModel from "../components/Modal/BgpConfCreate"
import formBgpConfModel from "../components/Forms/BGPConf"
import CommonAction from "./base"
import steps from "../steps/bgppeer"
import FORM_TEMPLATES from "../utils/form.templates"
import EditYAMLModal from "../components/Modal/EditYAML.jsx"
import { isUndefined } from "lodash"

const Actions = {
  ...CommonAction,
  "bgp.create": {
    on({ store, success, ...props }) {
      const formTemplate = FORM_TEMPLATES['bgp']()
      const modal = Modal.open({
        onOk: (formData) => {
          if (!isUndefined(formData.spec.nodeSelector) &&
            !formData.spec.nodeSelector.matchLabels["openelb.kubesphere.io/rack"]) {
            delete formData.spec.nodeSelector.matchLabels
          }
          store.create(formData).then(() => {
            Modal.close(modal)
            Notify.success({ content: "Created Successfully." })
            success && success()
          })
        },
        modal: CreateModal,
        steps,
        name: 'BgpPeer',
        formTemplate,
        store,
        okBtnText: 'Create',
        ...props,
      })
    }
  },
  "bgp.settings.edit": {
    on({ store, detail, success, ...props }) {
      const modal = Modal.open({
        onOk: data => {
          store.patch(detail, data).then(() => {
            Modal.close(modal)
            Notify.success({ content: "Updated successfully." })
            success && success()
          })
        },
        detail,
        modal: EditSettingsModal,
        title: 'Edit BgpPeer',
        store,
        ...props,
      })
    },
  },
  "bgp.yaml.edit": {
    on({ store, detail, success, ...props }) {
      const modal = Modal.open({
        onOk: data => {
          delete data.status
          store.patch(detail, data).then(() => {
            Modal.close(modal)
            Notify.success({ content: "Updated successfully." })
            success && success()
          })
        },
        detail,
        modal: EditYAMLModal,
        store,
        ...props,
      })
    },
  },
  "bgpconf.create": {
    on({ store, success, ...props }) {
      const formTemplate = FORM_TEMPLATES['bgpconf']()
      const modal = Modal.open({
        onOk: (formData) => {
          store.createConf(formData).then(() => {
            Modal.close(modal)
            Notify.success({ content: "Created successfully." })
            success && success()
          })
        },
        modal: CreateBgpConfModel,
        formModal: formBgpConfModel,
        create: true,
        name: 'BgpConf',
        formTemplate,
        store,
        okBtnText: 'Create',
        ...props,
      })
    }
  },
  "bgpconf.edit": {
    on({ store, detail, success, ...props }) {
      const formTemplate = FORM_TEMPLATES['bgpconf']()
      const modal = Modal.open({
        onOk: (data) => {
          store.patchConf(data).then(() => {
            Modal.close(modal)
            Notify.success({ content: "Updated successfully." })
            success && success()
          })
        },
        modal: CreateBgpConfModel,
        formModal: formBgpConfModel,
        name: 'BgpConf',
        formTemplate,
        detail,
        store,
        ...props,
      })
    }
  }
}

export default Actions