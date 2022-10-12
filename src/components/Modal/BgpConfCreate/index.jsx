import { get, isFunction, cloneDeep, isArray, omit, isEmpty } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@kube-design/components'
import Modal from '../../Base/Modal'
import Switch from '../../Base/Switch'
import Code from '../Create/Code'

import styles from './index.module.scss'
import { observer } from "mobx-react"
import { toJS } from "mobx"
import copy from 'fast-copy'

class CreateModal extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    name: PropTypes.string,
    module: PropTypes.string,
    steps: PropTypes.array,
    store: PropTypes.object,
    formTemplate: PropTypes.object,
    visible: PropTypes.bool,
    okBtnText: PropTypes.string,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    noCodeEdit: PropTypes.bool,
    isSubmitting: PropTypes.bool,
    formModal: PropTypes.func,
    create: PropTypes.bool,
    detail: PropTypes.object,
  }

  static defaultProps = {
    visible: false,
    noCodeEdit: false,
    isSubmitting: false,
    onOk() { },
    onCancel() { },
    detail: {}
  }

  constructor(props) {
    super(props)

    let detail
    if (!isEmpty(props.detail)) {
      detail = copy(toJS(props.detail))
    }
    this.state = {
      formTemplate: props.create ? cloneDeep(props.formTemplate) :
        { ...detail._originData, ...detail._statusData },
      isCodeMode: props.onlyCode || false,
    }

    this.codeRef = React.createRef()
    this.formRef = React.createRef()
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      let detail
      if (!isEmpty(detail)) {
        detail = copy(toJS(detail))
      }

      if (this.props.visible) {
        this.setState({
          isCodeMode: this.props.onlyCode || false,
          formTemplate: this.props.create ? cloneDeep(this.props.formTemplate) :
            { ...detail._originData, ...detail._statusData },
        })
      }
    }
  }

  getFormDataFromCode = code =>
    isArray(code)
      ? code.reduce(
        (prev, cur) => ({
          ...prev,
          [cur.kind.replace('Federated', '')]: cur,
        }),
        {}
      )
      : code

  handleModeChange = () => {
    this.setState(({ isCodeMode, formTemplate }) => {
      const kind = Object.keys(formTemplate)[0]
      const omitArr = [
        `${kind}.spec.template.totalReplicas`,
        'totalReplicas',
        `${kind}.totalReplicas`,
      ]
      formTemplate = omit(formTemplate, omitArr)
      const newState = { formTemplate, isCodeMode: !isCodeMode }

      if (isCodeMode && isFunction(get(this, 'codeRef.current.getData'))) {
        newState.formTemplate = this.getFormDataFromCode(
          this.codeRef.current.getData()
        )
      }

      return newState
    })
  }

  handleCreate = () => {
    const { onOk } = this.props
    const { formTemplate, isCodeMode } = this.state

    if (isCodeMode && isFunction(get(this, 'codeRef.current.getData'))) {
      onOk(this.codeRef.current.getData())
    } else {
      onOk(formTemplate)
    }
  }

  handleOk = () => {
    const { onOk } = this.props
    const { formTemplate, isCodeMode } = this.state

    if (isCodeMode && isFunction(get(this, 'codeRef.current.getData'))) {
      onOk(this.codeRef.current.getData())
    } else {
      onOk(formTemplate)
    }
  }

  handleCode = data => {
    const { onOk } = this.props
    onOk(data)
  }

  renderForms() {
    const { formTemplate } = this.state
    const contentWidth = this.props.contentWidth
    const FormModal = this.props.formModal

    return (
      <div className={styles.contentWrapper}>
        <div className={styles.content} style={{ width: contentWidth || 920 }}>
          <FormModal formRef={this.formRef} formTemplate={formTemplate} />
        </div>
      </div>
    )
  }

  renderCodeEditor() {
    const { onCancel, isSubmitting, okBtnText } = this.props
    const { formTemplate } = this.state
    return (
      <Code
        ref={this.codeRef}
        formTemplate={formTemplate}
        onOk={this.handleCode}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        okText={okBtnText}
        hideFooter
      />
    )
  }

  renderOperations() {
    const { noCodeEdit, onlyCode } = this.props
    const { isCodeMode } = this.state

    if (noCodeEdit || onlyCode) {
      return null
    }

    return (
      <Switch
        className={styles.switch}
        text={'Edit YAML'}
        onChange={this.handleModeChange}
        checked={isCodeMode}
      />
    )
  }

  render() {
    const { name, width, isSubmitting, visible, onCancel, noCodeEdit,
      okBtnText, create, ...rest } = this.props
    const { isCodeMode } = this.state

    const title = this.props.title || create ? `Create ${name}` : `Edit ${name}`

    return (
      <Modal
        width={width || 960}
        title={title}
        bodyClassName={styles.body}
        onCancel={onCancel}
        visible={visible}
        operations={this.renderOperations()}
        hideFooter
        {...rest}
      >
        {!noCodeEdit && isCodeMode
          ? this.renderCodeEditor()
          : this.renderForms()}
        {<div className={styles.footer}>
          <Button onClick={onCancel}>{'Cancel'}</Button>
          <Button
            type="control"
            onClick={create ? this.handleCreate : this.handleOk}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {okBtnText || create ? 'Create' : 'OK'}
          </Button>
        </div>}
      </Modal>
    )
  }
}

export default observer(CreateModal)