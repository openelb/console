import React from 'react'
import PropTypes from 'prop-types'
import { isEmpty } from 'lodash'
import { Icon } from '@kube-design/components'
import classnames from 'classnames'

import { ICON_TYPES } from '../../utils/constants'

import Tip from './Tip'

import styles from './index.module.scss'

export default class Banner extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    icon: PropTypes.string,
    module: PropTypes.string,
    tips: PropTypes.array,
  }

  static defaultProps = {
    tips: [],
    tabs: {},
    routes: [],
  }

  state = {
    openTip: '',
  }

  handleToggle = title => {
    this.setState(({ openTip }) => ({
      openTip: openTip === title ? '' : title,
    }))
  }

  get hiddenTips() {
    return (
      localStorage.getItem(`banner-tips`) || ''
    ).split(',')
  }

  handleClose = key => {
    if (!this.hiddenTips.includes(key)) {
      localStorage.setItem(
        'banner-tips',
        [...this.hiddenTips, key].join(',')
      )

      this.forceUpdate()
    }
  }

  renderTips(tips) {
    return (
      <div className={styles.tips}>
        {tips
          .filter(tip => !this.hiddenTips.includes(tip.title))
          .map((tip, index) => (
            <Tip
              key={index}
              {...tip}
              onClose={this.handleClose}
              onToggle={this.handleToggle}
              open={tip.title === this.state.openTip}
            />
          ))}
      </div>
    )
  }

  render() {
    const {
      className,
      title,
      description,
      icon,
      module,
      tips,
    } = this.props

    return (
      <div className={classnames(styles.wrapper, className)}>
        <div className={styles.titleWrapper}>
          <div className={styles.icon}>
            <Icon name={icon || ICON_TYPES[module] || 'catalog'} size={48} />
          </div>
          <div className={styles.title}>
            <div className="h3">{title}</div>
            <p className={styles.desc}>
              {description}
            </p>
          </div>
        </div>
        {!isEmpty(tips) && this.renderTips(tips)}
      </div>
    )
  }
}
