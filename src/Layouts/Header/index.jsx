import React, { Component } from 'react'
import { Button } from '@kube-design/components'
import { observer, inject } from 'mobx-react'
import logo from "../../assets/logo.svg"
import styles from "./index.module.scss"

class Header extends Component {
  handleClick = (link) => {
    this.props.rootStore.routing.push(link)
  }

  render() {
    return (
      <>
        <div className={styles.header}>
          <div className={styles.navs}>
            <Button
              type="flat"
              icon="eip-duotone"
              iconSize={16}
              onClick={() => this.handleClick("/eip")}
            >
              EIP
            </Button>
            <Button
              type="flat"
              icon="gateway-duotone"
              iconSize={16}
              onClick={() => this.handleClick("/bgp")}
            >
              BGP
            </Button>
          </div>
          <img className={styles.logo} src={logo} alt="openelb" onClick={() => this.handleClick("/eip")} />
        </div>
        <div className="header-bottom" />
      </>
    )
  }
}

export default inject("rootStore")(observer(Header))