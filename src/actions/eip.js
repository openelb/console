import Modal from '../components/Base/Modal'
import createModal from '../components/Modal/Create'

import CommonAction from "./base";
import steps from '../steps/eip';
import FORM_TEMPLATES from '../utils/form.templates'

const Actions = {
  ...CommonAction,
  "eip.create": {
    on({ store }) {
      const formTemplate = FORM_TEMPLATES['eip']()
      const modal = Modal.open({
        onOk: (formData) => {
          // TODO
          // need to implement the create action in eip Store
        },
        modal: createModal,
        steps,
        name: 'EIP',
        formTemplate,
        store,
        okBtnText: 'create',
      })
    }
  }
}

export default Actions