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

import { isUndefined, isEmpty } from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'

import { Input } from '@kube-design/components'

class NumberInput extends React.Component {
  static propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    min: PropTypes.number,
    max: PropTypes.number,
    onChange: PropTypes.func,
  }

  static defaultProps = {
    onChange() { },
  }

  handleChange = e => {
    const { onChange, min, max } = this.props
    const { value } = e.target

    if (isEmpty(value)) {
      onChange(value)
      return
    }

    let formatValue = Number(value)

    // invalid number
    if (isNaN(formatValue)) {
      return
    }

    // not smaller than min
    if (!isUndefined(min) && formatValue < min) {
      formatValue = min
    }

    // not bigger than max
    if (!isUndefined(max) && formatValue > max) {
      formatValue = max
    }

    onChange && onChange(formatValue)
  }

  render() {
    const {
      className,
      value,
      defaultValue,
      onChange,
      ...rest
    } = this.props

    let formatValue = isUndefined(value) ? defaultValue : value

    const props = {
      type: 'text',
      ...rest,
      value: isUndefined(formatValue) ? '' : formatValue,
      onChange: this.handleChange,
    }

    return <Input className={className} {...props} />
  }
}

export default NumberInput