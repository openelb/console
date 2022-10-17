import { Notify } from '@kube-design/components'
import Modal from '../components/Base/Modal'
import createModal from '../components/Modal/Create'
import viewYAMLModal from "../components/Modal/EditYAML.jsx"
import CommonAction from "./base"
import steps from '../steps/eip'
import FORM_TEMPLATES from '../utils/form.templates'
import disableEIPModal from "../components/Modal/DisableEIP"

const Actions = {
  ...CommonAction,
  "eip.create": {
    on({ store, success, ...props }) {
      const formTemplate = FORM_TEMPLATES['eip']()
      const modal = Modal.open({
        onOk: (formData) => {
          store.create(formData).then(() => {
            Modal.close(modal)
            Notify.success({ content: "Created successfully." })
            success && success()
          })
        },
        modal: createModal,
        steps,
        name: 'EIP',
        formTemplate,
        store,
        okBtnText: 'Create',
        ...props,
      })
    }
  },
  "eip.yaml.view": {
    on({ detail, success, ...props }) {
      Modal.open({
        detail,
        modal: viewYAMLModal,
        title: 'View YAML',
        readOnly: true,
        ...props,
      })
    }
  },
  "eip.disable": {
    on({ store, detail, success, ...props }) {
      const modal = Modal.open({
        onOk: (data) => {
          store.patch(detail, data).then(() => {
            Modal.close(modal)
            Notify.success({
              content:
                `${detail.disable ? 'Enabled' : 'Disabled'} successfully.`
            })
            success && success()
          })
        },
        modal: disableEIPModal,
        detail,
        store,
        resource: detail.name,
        ...props,
      })
    }
  }
}

export default Actions