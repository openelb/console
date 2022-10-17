/*
  * This file is part of KubeSphere Console.
  * Copyright (C) 2019 The KubeSphere Console Authors.
  *
  * KubeSphere Console is free software: you can redistribute it and/or modify
  * it under the terms of the GNU Affero General Public License as published by
  * the Free Software Foundation, either version 3 of the License, or
  * (at your option) any later version.
  *
  * KubeSphere Console is distributed in the hope that it will be useful,
  * but WITHOUT ANY WARRANTY; without even the implied warranty of
  * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  * GNU Affero General Public License for more details.
  *
  * You should have received a copy of the GNU Affero General Public License
  * along with KubeSphere Console.  If not, see <https://www.gnu.org/licenses/>.
  */

import React from 'react'
import PropTypes from 'prop-types'
import { toJS } from 'mobx'
import copy from 'fast-copy'

import { Columns, Column, Form, Input } from '@kube-design/components'
import Modal from '../../Base/Modal'
import NumberInput from "../../NumberInput"
import styles from "./index.module.scss"

export default class EditSettingsModal extends React.Component {
  static propTypes = {
    detail: PropTypes.object,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    isSubmitting: PropTypes.bool,
    title: PropTypes.string,
    store: PropTypes.object
  }

  static defaultProps = {
    title: "",
    visible: false,
    onOk() { },
    onCancel() { },
    isSubmitting: false,
    store: {},
  }

  constructor(props) {
    super(props)

    this.state = {
      formData: copy(toJS(props.detail._originData || props.detail)),
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible && this.props.visible !== prevProps.visible) {
      this.setState({
        formData: copy(
          toJS(this.props.detail._originData || this.props.detail)
        ),
      })
    }
  }

  handleOk = data => {
    const { onOk, store, detail } = this.props
    const list = store.list
    const selectedRowKeys = toJS(list.selectedRowKeys)
    const newSelectedRowKeys = selectedRowKeys
      ? selectedRowKeys.filter(item => item !== detail.uid)
      : ''
    onOk(data)
    if (selectedRowKeys) list.setSelectRowKeys(newSelectedRowKeys)
  }

  render() {
    const { visible, width, isSubmitting, onCancel, title } = this.props
    const { formData } = this.state
    const SendMaxDesc = "Maximum number of equivalent routes that OpenELB can send to the peer BGP router for Equal-Cost Multi-Path (ECMP) routing. The default value is 10."

    return (
      <Modal.Form
        data={formData}
        width={width || 960}
        title={title}
        onOk={this.handleOk}
        okText="OK"
        onCancel={onCancel}
        visible={visible}
        isSubmitting={isSubmitting}
      >
        <div className={styles.contentWrapper}>
            <Columns>
              <Column>
                <Form.Item
                  label="Peer AS"
                  rules={[{ required: true, message: 'Peer AS is required.' }]}
                >
                  <NumberInput name="spec.conf.peerAs" min={0} />
                </Form.Item>
              </Column>
              <Column>
                <Form.Item
                  label="Neighbor Address"
                  rules={[{ required: true, message: 'Neighbor Address is required.' }]}
                >
                  <Input name="spec.conf.neighborAddress" />
                </Form.Item>
              </Column>
            </Columns>
            <Columns>
              <Column>
                <Form.Item
                  label="SendMax"
                  desc={SendMaxDesc}
                >
                  <NumberInput name="spec.afiSafis[0].addPaths.config.sendMax" min={0} />
                </Form.Item>
              </Column>
              <Column>
                <Form.Item
                  label="BgpPeer Leaf"
                >
                  <Input name="spec.nodeSelector.matchLabels['openelb.kubesphere.io/rack']" />
                </Form.Item>
              </Column>
            </Columns>
          </div>
      </Modal.Form>
    )
  }
}
