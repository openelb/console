import React from 'react'
import PropTypes from 'prop-types'
import { Button, Icon } from '@kube-design/components'
import classnames from 'classnames'

import styles from './index.module.scss'

export default class Tip extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    closable: PropTypes.bool,
    operation: PropTypes.node,
    onClose: PropTypes.func,
  }

  static defaultProps = {
    closable: true,
    onClose() {},
  }

  handleClose = () => {
    const { onClose, title } = this.props

    onClose(title)
  }

  handleToggle = () => {
    const { onToggle, title } = this.props

    onToggle(title)
  }

  stopPropagation = e => {
    e.stopPropagation()
  }

  render() {
    const {
      className,
      title,
      description,
      operation,
      more,
      closable,
      open,
    } = this.props

    return (
      <div
        className={classnames(styles.tip, { [styles.open]: open }, className)}
        onClick={this.handleToggle}
      >
        <div className={styles.tipIcon}>
          <Icon name={open ? 'chevron-down' : 'chevron-right'} size={20} />
        </div>
        <div className={styles.tipContent}>
          <div>{title}</div>
          {open && <p className="text-second">{description}</p>}
        </div>
        <div className={styles.operations} onClick={this.stopPropagation}>
          {operation}
          {more && (
            <a href={more} target="_blank" rel="noreferrer noopener">
              <Button>Learn more</Button>
            </a>
          )}
          {closable && (
            <Icon name="close" size={20} clickable onClick={this.handleClose} />
          )}
        </div>
      </div>
    )
  }
}
