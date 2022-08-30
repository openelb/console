import { Icon } from "@kube-design/components"
import { Component } from "react"
import styles from "./index.module.scss"

class Service extends Component {
  get services() {
    return this.props.used
  }

  render() {
    return (
      <div className={styles.services}>
        <p>Services</p>
        <div>
          <div>
            {Object.entries(this.services).map((svc, _) => {
              const [ip, value] = svc
              const [namespace, name] = value.split("/")
              return (
                <div key={ip}>
                  <div className={styles.title}>
                    <Icon name="appcenter" size={40} />
                    <div>
                      <p className={styles.valuetext}>{name}</p>
                      <p className={styles.keytext}>Service</p>
                    </div>
                  </div>
                  <div className={styles.namespace}>
                    <p className={styles.valuetext}>{namespace}</p>
                    <p className={styles.keytext}>Namespace</p>
                  </div>
                  <div className={styles.ip}>
                    <p className={styles.valuetext}>{ip}</p>
                    <p className={styles.keytext}>IP Address</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}

export default Service