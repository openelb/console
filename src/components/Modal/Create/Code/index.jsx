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

import { Button } from '@kube-design/components'
import EditMode from '../../../EditMode'

import styles from './index.module.scss'

export default class CodeMode extends React.Component {
  static propTypes = {
    formTemplate: PropTypes.object,
    onOk: PropTypes.func,
    isSubmitting: PropTypes.bool,
    hideFooter: PropTypes.bool,
    okText: PropTypes.string,
    readOnly: PropTypes.bool,
  }

  static defaultProps = {
    onOk() { },
    isSubmitting: false,
    hideFooter: false,
    okText: 'Create',
    readOnly: false
  }

  constructor(props) {
    super(props)

    this.editor = React.createRef()
  }

  getData() {
    return this.editor.current.getData()
  }

  handleCreate = () => {
    const { onOk } = this.props
    onOk(this.getData())
  }

  render() {
    const { formTemplate, onCancel, isSubmitting, hideFooter, okText, readOnly } = this.props
    return (
      <div>
        <div className={styles.wrapper}>
          <EditMode ref={this.editor} value={formTemplate} readOnly={readOnly} />
        </div>
        {!hideFooter && !readOnly ? <div className={styles.footer}>
          <Button onClick={onCancel}>{'Cancel'}</Button>
          <Button
            type="control"
            onClick={this.handleCreate}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            {okText}
          </Button>
        </div> : <></>}
      </div>
    )
  }
}
