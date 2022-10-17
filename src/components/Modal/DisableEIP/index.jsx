import React from "react"
import PropTypes from 'prop-types'
import { toJS } from "mobx"
import { Button, Icon } from "@kube-design/components"
import Modal from "../../Base/Modal"
import styles from './index.module.scss'

export default class DisableEIPModal extends React.Component {
  static propTypes = {
    type: PropTypes.string,
    resource: PropTypes.string,
    title: PropTypes.string,
    isSubmitting: PropTypes.bool,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    detail: PropTypes.object,
    store: PropTypes.object,
  }

  static defaultProps = {
    isSubmitting: false,
    onOk() { },
    onCancel() { },
    store: {},
  }

  handleOk = () => {
    const { onOk, store, detail } = this.props
    const list = store.list
    const selectedRowKeys = toJS(list.selectedRowKeys)
    const newSelectedRowKeys = selectedRowKeys
      ? selectedRowKeys.filter(item => item !== detail.uid)
      : ''
    onOk(
      {
        'spec': {
          'disable': !detail.disable
        }
      }
    )
    if (selectedRowKeys) list.setSelectRowKeys(newSelectedRowKeys)
  }

  render() {
    const { type,
      resource,
      title,
      detail,
      onCancel,
      isSubmitting,
      visible
    } = this.props

    const action = detail.disable ? 'Enable' : 'Disable'
    const actionLower = action.toLowerCase()

    const titleText = title || type ? `${action} ${type}` : `${action}`
    const desc = `Are you sure you want to ${title ? title.split(" ")[0].toLowerCase()
     : `${actionLower}`} ${type ? `the ${type} ` : ''}${resource}?`

    return (
      <Modal
        visible={visible}
        isSubmitting={isSubmitting}
        onCancel={onCancel}
        bodyClassName={styles.modalBody}
        hideHeader
        hideFooter>
        <div className={styles.body}>
          <Icon name="question" size={20} 
          color={{ primary: "#FFFFFF", secondary: "#329DCE" }} />
          <div className={styles.text}>
            <div className="h6">{titleText}</div>
            <div className="p">{desc}</div>
          </div>
        </div>
        <div className={styles.footer}>
          <Button onClick={onCancel} data-test="modal-cancel">
            Cancel
          </Button>
          <Button
            type="control"
            loading={isSubmitting}
            disabled={isSubmitting}
            onClick={this.handleOk}
            data-test="modal-ok"
          >
            OK
          </Button>
        </div>
      </Modal>
    )
  }
}