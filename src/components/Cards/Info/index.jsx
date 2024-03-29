import { Component } from "react"
import moment from "moment"
import { Button, Dropdown, Icon, Menu } from "@kube-design/components"
import styles from "./index.module.scss"
import { inject } from "mobx-react"
import { trigger } from "../../../utils/action"

class Info extends Component {
  get detail() {
    return this.props.detail
  }

  get routing() {
    return this.props.rootStore.routing
  }

  get name() {
    return "EIP"
  }

  get eip() {
    return this.props.eip
  }

  get store() {
    return this.props.store
  }

  async fetchData() {
    await this.store.fetchDetail({ name: this.eip })
  }

  handleBackButtonClick() {
    this.routing.push("/eip")
  }

  handleMoreMenuItemClick(e, key, value, isEnabled) {
    switch (key) {
      case "disable":
        this.trigger('eip.disable', {
          type: this.name,
          detail: this.detail,
          success: this.fetchData.bind(this),
          store: this.store
        })
        break
      case "delete":
        this.trigger('resource.delete', {
          type: this.name,
          resource: this.eip,
          detail: this.detail,
          store: this.store,
          success: () => this.routing.push("/eip"),
        })
        break
      default:
        break
    }
  }

  handleYAMLButtonClick() {
    this.trigger('eip.yaml.view', {
      detail: this.detail,
      store: this.store,
    })
  }

  detailsKeys() {
    return [
      "Address",
      "Protocol",
      "FirstIP",
      "LastIP",
      "Addres Family",
      "Creation Time",
    ]
  }

  valueItems() {
    return [
      <p key="Address" className={styles.valuetext}>{this.detail.address}</p>,
      <div key="Protocol" className={styles.cell}>
        <p className={styles.valuetext}>{this.detail.protocol}</p>
        {this.detail.protocol === 'layer2' ? (<div className={styles.tag}>
          <p>{this.detail.interface}</p>
        </div>) : <></>}
      </div>,
      <p key="First IP" className={styles.valuetext}>{this.detail.firstIP}</p>,
      <p key="Last IP" className={styles.valuetext}>{this.detail.lastIP}</p>,
      <p key="Address Family" className={styles.valuetext}> {this.detail.addressFamily}</p>,
      <p key="Creation Time" className={styles.valuetext}>
        {moment(new Date(this.detail.createTime))
          .format('YYYY-MM-DD hh:mm:ss') || '-'}
      </p>
    ]
  }

  renderMoreMenu() {
    const isEnabled = !this.detail.disable
    return (<Menu onClick={
      (e, key, value) => this.handleMoreMenuItemClick(e, key, value, isEnabled)}>
      <Menu.MenuItem key="disable" value="god">
        <Icon name={isEnabled ? "stop" : "start"} size={16} color={{ primary: "#FFFFFF" }} />
        <p className={styles.itemtext}>{
          isEnabled ? "Disable" : "Enable"
        }</p>
      </Menu.MenuItem>
      <Menu.MenuItem key="delete">
        <Icon name="trash" size={16} color={{ primary: "#FFFFFF" }} />
        <p className={styles.itemtext}>Delete</p>
      </Menu.MenuItem>
    </Menu>)
  }

  renderInfo() {
    let isDefault
    if (this.detail.default === 'true') {
      isDefault = 'default'
    }

    return (
      <div className={styles.info}>
        <div className={styles.button} onClick={() => this.handleBackButtonClick()}>
          <Icon name="chevron-left" size={16} color={{ primary: "#329DCE" }} />
          <p>EIP</p>
        </div>

        <div className={styles.datagroup}>
          <Icon name="eip-duotone" size={28} />
          <p>{this.detail.name}</p>
          <div>
            <p>{isDefault}</p>
          </div>
        </div>

        <div className={styles.buttongroup}>
          <Button onClick={this.handleYAMLButtonClick.bind(this)}>View YAML</Button>
          <Dropdown theme="dark" content={this.renderMoreMenu.bind(this)} >
            <Button>
              More
              <Icon name="caret-down" size={16} /></Button>
          </Dropdown>
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.body}>
        {this.renderInfo()}
        <div className={styles.details}>
          <p>Details</p>
          <div>
            <div>
              {this.detailsKeys().map((key) => (
                <p key={key} className={styles.keytext}>{key}</p>
              ))}
            </div>
            <div>
              {this.valueItems()}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default inject("rootStore")(trigger(Info))