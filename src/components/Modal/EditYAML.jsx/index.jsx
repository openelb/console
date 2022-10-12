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

import Modal from '../../Base/Modal'
import Code from '../Create/Code'
import styles from './index.module.scss'

export default class EditYAMLModal extends React.Component {
  static propTypes = {
    detail: PropTypes.object,
    visible: PropTypes.bool,
    onOk: PropTypes.func,
    onCancel: PropTypes.func,
    isSubmitting: PropTypes.bool,
    readOnly: PropTypes.bool,
  }

  static defaultProps = {
    visible: false,
    onOk() { },
    onCancel() { },
    isSubmitting: false,
    readOnly: false,
  }

  constructor(props) {
    super(props)

    const detail = copy(toJS(props.detail))
    this.state = {
      formData: detail._originData ? { ...detail._originData, ...detail._statusData } : detail,
    }

    this.codeRef = React.createRef()
  }

  componentDidUpdate(prevProps) {
    if (this.props.visible && this.props.visible !== prevProps.visible) {
      const detail = copy(toJS(this.props.detail))
      this.setState({
        formData: detail._originData ?
          { ...detail._originData, ...detail._statusData } : detail,
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

  renderCodeEditor() {
    const { isSubmitting, onCancel, readOnly } = this.props
    const { formData } = this.state

    return (
      <Code
        ref={this.codeRef}
        formTemplate={formData}
        onOk={this.handleOk}
        onCancel={onCancel}
        isSubmitting={isSubmitting}
        okText="OK"
        readOnly={readOnly}
      />
    )
  }

  render() {
    const { visible, width, onCancel, readOnly, ...rest } = this.props

    return (
      <Modal
        width={width || 960}
        title="Edit YAML"
        icon={readOnly ? 'eye' : 'pen'}
        bodyClassName={styles.body}
        onCancel={onCancel}
        visible={visible}
        {...rest}
        hideFooter
      >
        {this.renderCodeEditor()}
      </Modal>
    )
  }
}
