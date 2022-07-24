import { Button } from "@kube-design/components"
import logo from "../../assets/logo.svg"
import styles from "./index.module.scss"

export default function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.navs}>
        <Button
          type="flat"
          icon="gateway"
        >
          EIP
        </Button>
        <Button
          type="flat"
          icon="cogwheel"
        >
          BGP
        </Button>
      </div>
      <img className={styles.logo} src={logo} alt="openelb" />
    </div>
  )
}