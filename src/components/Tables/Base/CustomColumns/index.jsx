import React, { Component } from 'react'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { Icon, Dropdown, Button } from '@kube-design/components'
import { includes, remove, get, isUndefined, isEmpty } from 'lodash'

import styles from './index.module.scss'

class CustomColumns extends Component {
  static propTypes = {
    value: PropTypes.array,
    onChange: PropTypes.func.isRequired,
    className: PropTypes.string,
    title: PropTypes.node,
    columns: PropTypes.array.isRequired,
  }

  static defaultProps = {
    value: [],
    columns: [],
  }

  constructor(props) {
    super(props)

    this.hideableColumns = props.columns
      .filter(column => column.isHideable)
      .map(column => ({
        label: column.title,
        value: column.dataIndex || column.key,
      }))
  }

  isVisibleOption(option) {
    const { value } = option
    const { value: hideColumns } = this.props
    return !includes(hideColumns, value)
  }

  handleOptionClick = e => {
    const value = get(e, 'currentTarget.dataset.value')
    const { value: hideColumns, onChange } = this.props
    const duplicate = [...hideColumns]
    includes(duplicate, value)
      ? remove(duplicate, visibleValue => visibleValue === value)
      : duplicate.push(value)
    onChange(duplicate)
  }

  renderContent() {
    const { className } = this.props
    return (
      <div className={classnames(styles.wrapper, className)}>
        {this.renderHeader()}
        {this.renderOptions()}
      </div>
    )
  }

  renderHeader() {
    const { title } = this.props
    return isUndefined(title) ? null : <header>{title}</header>
  }

  renderOptions() {
    return <ul>{this.hideableColumns.map(this.renderOption, this)}</ul>
  }

  renderOption(option) {
    const isVisible = this.isVisibleOption(option)
    const { value, label } = option
    const iconName = isVisible ? 'eye' : 'eye-closed'
    return (
      <li data-value={value} key={value} onClick={this.handleOptionClick}>
        <Icon name={iconName} />
        {label}
      </li>
    )
  }

  render() {
    if (isEmpty(this.hideableColumns)) {
      return null
    }

    return (
      <Dropdown content={this.renderContent()} placement="bottomRight">
        <Button type="flat" icon="cogwheel" data-test="table-columns" />
      </Dropdown>
    )
  }
}

export default CustomColumns
