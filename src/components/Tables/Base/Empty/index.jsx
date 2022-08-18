import React from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { isUndefined } from 'lodash'

import { Icon } from '@kube-design/components'

import { ICON_TYPES } from '../../../../utils/constants'

import styles from './index.module.scss'

export default class EmptyTable extends React.PureComponent {
  static propTypes = {
    module: PropTypes.string,
    name: PropTypes.string,
    title: PropTypes.string,
    desc: PropTypes.string,
    className: PropTypes.string,
    action: PropTypes.node,
  }

  static defaultProps = {
    name: '',
    module: '',
  }

  render() {
    const { module, icon, action, className } = this.props

    const _icon = icon || ICON_TYPES[module] || 'appcenter'
    
    const title = `No ${module} Found`
    const desc = `Please create a ${module}.`

    return (
      <div className={classnames(styles.wrapper, className)}>
        <div className={styles.image}>
          <Icon name={_icon} size={48} />
        </div>
        <div className={styles.title}>
          {title}
        </div>
        <p className={styles.desc}>
          {desc}
        </p>
        {action && <div className={styles.actions}>{action}</div>}
      </div>
    )
  }
}
