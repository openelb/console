import { Button } from "@kube-design/components"
import logo from "../../assets/logo.svg"
import styles from "./index.module.scss"

export default function Header() {
  return (
    <div className={styles.header}>
      <div className={styles.navs}>
        <Button
          type="flat"
          icon="eip-duotone"
        >
          EIP
        </Button>
        <Button
          type="flat"
          icon="gateway-duotone"
        >
          BGP
        </Button>
      </div>
      <img className={styles.logo} src={logo} alt="openelb" />
    </div>
  )
}