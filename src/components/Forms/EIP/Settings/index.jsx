import React from 'react'
import { observer } from 'mobx-react'
import { Form, Columns, Column, Input, Select, Toggle } from '@kube-design/components'
import { get, set } from 'lodash'

import styles from './index.module.scss'
import IPSelect from './IPSelect'
const IPDesc = "One or more IP addresses, which will be used by OpenELB, The value format can be like IP 、IP/Subnet mask、IP segment."

class EipSettings extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ipType: 'IP',
      protocol: 'bgp',
      address: get(props.formTemplate, 'spec.address'),
      isDefault: get(props.formTemplate, "metadata.annotation['eip.openelb.kubesphere.io/is-default-eip']", false),
      disable: get(props.formTemplate, 'spec.disable', false),
    }
  }

  handleDefaultChange = (value) => {
    const { formTemplate } = this.props

    this.setState({
      isDefault: value
    }, () => {
      set(formTemplate, "metadata.annotation['eip.openelb.kubesphere.io/is-default-eip']", value)
    })
  }

  handleDisabledChange = (value) => {
    const { formTemplate } = this.props

    this.setState({
      disable: value
    }, () => {
      set(formTemplate, "spec.disable", value)
    })
  }

  handleProtocolChange = (value) => {
    this.setState({
      protocol: value
    })
  }

  render() {
    const { formRef, formTemplate } = this.props
    const { isDefault, disable, protocol } = this.state

    return (
      <Form data={formTemplate} ref={formRef}>
        <Columns>
          <Column>
            <Form.Item
              label={"Address"}
              desc={IPDesc}
              rules={[{ required: true, message: 'Address is required.' }]}
            >
              <IPSelect name="spec.address" />
            </Form.Item>
          </Column>
          <Column></Column>
        </Columns>
        <Columns>
          <Column>
            <Form.Item
              label={"Protocol"}
              desc={"Specifies which mode of OpenELB the Eip object is used for. "}
              rules={[{ required: true, message: 'Protocol is required.' }]}
            >
              <Select
                name={"spec.protocol"}
                options={[
                  {
                    label: 'bgp',
                    value: 'bgp'
                  },
                  {
                    label: 'layer2',
                    value: 'layer2'
                  },
                  {
                    label: 'vip',
                    value: 'vip'
                  },
                ]}
                defaultValue={'bgp'}
                onChange={this.handleProtocolChange}
                placeholder="Select Protocol"
              />
            </Form.Item>
          </Column>
          <Column>
            <Form.Item
              label={"Interface"}
              desc={"NIC on which OpenELB listens for ARP or NDP requests. "}
              rules={[{ required: protocol !== 'bgp', message: 'Interface is required.' }]}
            >
              <Input name={"spec.interface"} />
            </Form.Item>
          </Column>
        </Columns>
        <div className={styles.card}>
          <div className={styles.icon}>
            <Toggle checked={isDefault} onChange={this.handleDefaultChange} />
          </div>
          <div>
            <p className={styles.title}>
              {"Set as default EIP"}
            </p>
            <p className={styles.des}>
              {"If a default EIP object exists, the system automatically assigns an IP address from the default EIP object to the Service，For each Kubernetes cluster, you can set only one EIP object as the default EIP object."}
            </p>
          </div>
        </div>
        <div className={styles.card}>
          <div className={styles.icon}>
            <Toggle checked={disable} onChange={this.handleDisabledChange} />
          </div>
          <div>
            <p className={styles.title}>
              {"Disable EIP"}
            </p>
            <p className={styles.des}>
              {"If EIP is disabled, OpenELB will stop assigning IP addresses in the EIP object to new LoadBalancer Services. Existing Services are not affected."}
            </p>
          </div>
        </div>
      </Form>
    )
  }
}

export default observer(EipSettings)