import { get, isFunction, cloneDeep, isArray, omit } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { Form, Columns, Column, Input } from '@kube-design/components'
import Modal from '../../Base/Modal'
import Switch from '../../Base/Switch'
import Code from '../Create/Code'

import styles from './index.module.scss'
import { observer } from "mobx-react"
import NumberInput from "../../NumberInput"

class CreateModal extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    name: PropTypes.string,
    module: PropTypes.string,
    steps: PropTypes.array,
    store: PropTypes.object,
    formTemplate: PropTypes.object,
    visible: PropTypes.bool,
    okBtnText: PropTypes.string, // not requried
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    noCodeEdit: PropTypes.bool,
    isSubmitting: PropTypes.bool,
  }

  static defaultProps = {
    visible: false,
    noCodeEdit: false,
    isSubmitting: false,
    onOk() { },
    onCancel() { },
  }

  constructor(props) {
    super(props)

    this.state = {
      formTemplate: cloneDeep(props.formTemplate),
      isCodeMode: props.onlyCode || false,
    }

    this.codeRef = React.createRef()
    this.formRef = React.createRef()
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible !== prevProps.visible) {
      if (this.props.visible) {
        this.setState({
          isCodeMode: this.props.onlyCode || false,
          formTemplate: cloneDeep(this.props.formTemplate),
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

  handleCode = data => {
    const { onOk } = this.props
    onOk(this.getFormDataFromCode(data))
  }

  renderForms() {
    const { formTemplate } = this.state

    return (
      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <Form
            {...this.props}
            ref={this.formRef}
            data={formTemplate}
          >
            <Columns>
              <Column>
                <Form.Item
                  label="Name"
                  desc="OpenELB recognizes only the name default. BgpConf objects with other names will be ignored."
                >
                  <Input name="metadata.name" disabled />
                </Form.Item>
              </Column>
              <Column>
                <Form.Item
                  label="ASN"
                  desc="Local ASN, which must be different from the value of spec:conf:peerAS in the BgpPeer configuration."
                  rules={[{ required: true, message: 'ASN is required.' }]}
                >
                  <NumberInput name="spec.as" min={0} />
                </Form.Item>
              </Column>
            </Columns>
            <Columns>
              <Column>
                <Form.Item
                  label="ListenPort"
                  desc="The default value is 179 (default BGP port number). If other components (such as Calico) in the Kubernetes cluster also use BGP and port 179, you must set a different value to avoid the conflict."
                  rules={[{ required: true, message: 'ListenPort is required.' }]}
                >
                  <NumberInput name="spec.listenPort" min={0} />
                </Form.Item>
              </Column>
              <Column>
                <Form.Item
                  label="RouterID"
                  desc="Local router ID, which is usually set to the IP address of the master NIC of the Kubernetes master node. If this field is not specified, the first IP address of the node where openelb-manager is located will be used."
                >
                  <Input name="spec.routerId" />
                </Form.Item>
              </Column>
            </Columns>
          </Form>
        </div>
      </div>
    )
  }

  renderCodeEditor() {
    const { onCancel, isSubmitting } = this.props
    const { formTemplate } = this.state
    return (
      <Code
        ref={this.codeRef}
        formTemplate={formTemplate}
        onOk={this.handleCode}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        hideFooter={true}
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
    const { name, width, visible, onCancel, noCodeEdit, ...rest } = this.props
    const { isCodeMode } = this.state

    const title = this.props.title || `Create ${name}`

    return (
      <Modal
        width={width || 960}
        title={title}
        bodyClassName={styles.body}
        onCancel={onCancel}
        visible={visible}
        {...rest}
        operations={this.renderOperations()}
        okText="Create"
        footerClassName={styles.footer}
      >
        {!noCodeEdit && isCodeMode
          ? this.renderCodeEditor()
          : this.renderForms()}
      </Modal>
    )
  }
}

export default observer(CreateModal)