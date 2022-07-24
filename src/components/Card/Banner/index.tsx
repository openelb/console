import classnames from "classnames"
import { isEmpty } from "lodash"
import { useState } from "react"
import { Icon } from "@kube-design/components"
import Tip from "./Tip"
import styles from "./index.module.scss"

export default function Banner(props: BannerProps) {
  const {
    className,
    title,
    description,
    icon,
    tips,
  } = props
  
  const [openTip, setOpenTip] = useState("")
  const [value, setValue] = useState(0); // integer state for force update
  
  const docUrl = ""

  function forceUpdate(){
    setValue(value + 1);
  }

  const handleToggle = (title: string)=> {
    setOpenTip(openTip === title ? "" : title)
  }

  function hiddenTips() {
    return (
      localStorage.getItem("banner-tips") || ""
    ).split(",")
  }

  const handleClose = (key: string) => {
    if (!hiddenTips().includes(key)) {
      localStorage.setItem(
        "banner-tips",
        [...hiddenTips(), key].join(",")
      )

      forceUpdate()
    }
  }

  function renderTips(tips: any[]) {
    return (
      <div className={styles.tips}>
        {tips
          .filter(tip => !hiddenTips().includes(tip.title))
          .map((tip, index) => (
            <Tip
              key={index}
              {...tip}
              onClose={handleClose}
              onToggle={handleToggle}
              open={tip.title === openTip}
            />
          ))}
      </div>
    )
  }

  return (
    <div className={classnames(styles.wrapper, className)}>
      <div className={styles.titleWrapper}>
        <div className={styles.icon}>
          <Icon name={icon || "catalog"} size={48} />
        </div>
        <div className={styles.title}>
          <div className="h3">{title}</div>
          <p className="text-second">
            {description}
            {docUrl && (
              <span className={styles.more}>
                <Icon name="documentation" size={20} />
                <a href={docUrl} target="_blank" rel="noreferrer noopener">
                  LEARN_MORE
                </a>
              </span>
            )}
          </p>
        </div>
      </div>
      {!isEmpty(tips) && renderTips(tips!)}
    </div>
  )
}

type BannerProps = {
  className?: string,
  title?: string,
  description?: string,
  icon?: string,
  module?: string,
  tips?: any[],
}