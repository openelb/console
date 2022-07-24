import React from "react"
import { Button, Icon } from "@kube-design/components"
import classnames from "classnames"

import styles from "./index.module.scss"

export default function Tip(props: TipProps) {
  const {
    className,
    title,
    description,
    operation,
    more,
    closable = true,
    open,
  } = props

  const handleClose = () => {
    const { onClose, title } = props

    onClose(title)
  }

  const handleToggle = () => {
    const { onToggle, title } = props

    onToggle(title)
  }

  const stopPropagation = (e: { stopPropagation: () => void }) => {
    e.stopPropagation()
  }

  return (
    <div
      className={classnames(styles.tip, { [styles.open]: open }, className)}
      onClick={handleToggle}
    >
      <div className={styles.tipIcon}>
        <Icon name={open ? "chevron-down" : "chevron-right"} size={20} />
      </div>
      <div className={styles.tipContent}>
        <div>{title}</div>
        {open && <p className="text-second">{description}</p>}
      </div>
      <div className={styles.operations} onClick={stopPropagation}>
        {operation}
        {more && (
          <a href={more} target="_blank" rel="noreferrer noopener">
            <Button>Learn More</Button>
          </a>
        )}
        {closable && (
          <Icon name="close" size={20} clickable onClick={handleClose} />
        )}
      </div>
    </div>
  )
}

type TipProps = {
  className?: string,
  title?: string,
  description?: string | React.ReactNode,
  closable: boolean,
  more?: string,
  open?: boolean,
  operation: React.ReactNode,
  onClose: (...params: any) => any,
  onToggle: (...params: any) => any
}