import { Loading, Tooltip } from "@kube-design/components"
import { toJS } from "mobx"
import { inject, observer } from "mobx-react"
import { Component } from "react"
import Info from "../../../components/Cards/Info"
import Service from "../../../components/Lists/Service"
import EipStore from "../../../stores/eip"
import { trigger } from "../../../utils/action"
import checkedApps from "../../../assets/checked-apps.svg"
import checkedCircleGraph from "../../../assets/checked-circle-graph.svg"
import checkedEipDuotone from "../../../assets/checked-eip-duotone.svg"
import crossedApps from "../../../assets/crossed-apps.svg"
import crossedCircleGraph from "../../../assets/crossed-circle-graph.svg"
import crossedEipDuotone from "../../../assets/crossed-eip-duotone.svg"
import styles from "./index.module.scss"

class Detail extends Component {
  get eip() {
    return this.props.match.params.eip
  }

  get routing() {
    return this.props.rootStore.routing
  }

  componentDidMount() {
    this.store.fetchDetail({ name: this.eip })
  }

  store = new EipStore()

  renderStatus(detail) {
    return (
      <div className={styles.status}>
        <div className={styles.tab}>
          <div>
            <p>Resource Status</p>
          </div>
        </div>
        <div className={styles.stats}>
          <p>Status</p>
          <div>
            <div className={styles.row1}>
              <Tooltip content={`spec:disable:${detail.disable}`}>
                <img src={detail.disable ? crossedEipDuotone : checkedEipDuotone}
                  alt="" />
              </Tooltip>
              <div>
                <p className={styles.valuetext}>
                  {detail.disable ? "Disabled" : "Enabled"}</p>
                <p className={styles.keytext}>EIP Status</p>
              </div>
              <div>
                <p className={styles.valuetext}>{detail.usage}</p>
                <p className={styles.keytext}>Usage</p>
              </div>
              <div>
                <p className={styles.valuetext}>{detail.poolSize}</p>
                <p className={styles.keytext}>PoolSize</p>
              </div>
            </div>
            <div className={styles.row2}>
              <div>
                <Tooltip content={`status:occupied:${detail.occupied}`}>
                  <img src={detail.occupied ? crossedCircleGraph : checkedCircleGraph}
                    alt="" />
                </Tooltip>
                <div>
                  <p className={styles.valuetext}>
                    {detail.occupied ? "Used Up" : "Not Used Up"}
                  </p>
                  <p className={styles.keytext}>IP addresses in the EIP object</p>
                </div>
              </div>
              <div>
                <Tooltip content={`status:ready:${detail.ready}`}>
                  <img src={detail.ready ? checkedApps : crossedApps} alt="" />
                </Tooltip>
                <div>
                  <p className={styles.valuetext}>
                    {detail.ready ? "Initialized" : "Not Initialized"}
                  </p>
                  <p className={styles.keytext}>Eip-associated program</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Service used={detail.used} />
      </div>
    )
  }

  render() {
    if (this.store.isLoading && !this.store.detail.name) {
      return <Loading className="ks-page-loading" />
    }

    const detail = toJS(this.store.detail)
    return (
      <div className={styles.body}>
        <Info detail={detail} routing={this.routing} store={this.store} />
        {this.renderStatus(detail)}
      </div>
    )
  }
}

export default inject("rootStore")(observer(trigger(Detail)))