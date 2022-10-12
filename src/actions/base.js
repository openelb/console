import { Notify } from '@kube-design/components'
import Modal from '../components/Base/Modal'
import DeleteModal from "../components/Modal/Delete"
import EditBaseInfoModal from '../components/Modal/EditBaseInfo'

const CommonAction = {
  "resource.delete": {
    on({ store, detail, success, ...props }) {
      const modal = Modal.open({
        onOk: () => {
          store.delete(detail).then(() => {
            Modal.close(modal)
            Notify.success({ content: "Deleted successfully." })
            success && success()
          })
        },
        store,
        modal: DeleteModal,
        resource: detail.name,
        ...props,
      })
    },
  },
  "resource.baseinfo.edit": {
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
        modal: EditBaseInfoModal,
        store,
        ...props,
      })
    },
  },
  "resource.batch.delete": {
    on({ store, success, rowKey, ...props }) {
      const { data, selectedRowKeys } = store.list
      const selectValues = data
        .filter(item => selectedRowKeys.includes(item[rowKey]))
        .map(item => {
          return { name: item.name, namespace: item.namespace }
        })

      const selectNames = selectValues.map(item => item.name)

      const modal = Modal.open({
        onOk: async () => {
          const reqs = []

          data.forEach(item => {
            const selectValue = selectValues.find(
              value =>
                value.name === item.name && value.namespace === item.namespace
            )

            if (selectValue) {
              reqs.push(store.delete(item))
            }
          })

          await Promise.all(reqs)

          Modal.close(modal)
          Notify.success({ content: "Deleted successfully." })
          store.setSelectRowKeys([])
          success && success()
        },
        resource: selectNames.join(', '),
        modal: DeleteModal,
        store,
        ...props,
      })
    },
  }
}

export default CommonAction