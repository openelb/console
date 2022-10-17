import React from "react"
import { Column, Columns, Form, Input } from "@kube-design/components"
import NumberInput from "../../NumberInput"

class BgpConfSettings extends React.Component {
  render() {
    const { formRef, formTemplate } = this.props

    return (
      <Form
        {...this.props}
        ref={formRef}
        data={formTemplate}
      >
        <Columns>
          <Column>
            <Form.Item
              label="Name"
              desc="OpenELB recognizes only the name default. BgpConf objects with other names will be ignored."
            >
              <Input name="metadata.name" disabled />
            </Form.Item>
          </Column>
          <Column>
            <Form.Item
              label="ASN"
              desc="Local ASN, which must be different from the value of spec:conf:peerAS in the BgpPeer configuration."
              rules={[{ required: true, message: 'ASN is required.' }]}
            >
              <NumberInput name="spec.as" min={0} />
            </Form.Item>
          </Column>
        </Columns>
        <Columns>
          <Column>
            <Form.Item
              label="ListenPort"
              desc="The default value is 179 (default BGP port number). If other components (such as Calico) in the Kubernetes cluster also use BGP and port 179, you must set a different value to avoid the conflict."
              rules={[{ required: true, message: 'ListenPort is required.' }]}
            >
              <NumberInput name="spec.listenPort" min={0} />
            </Form.Item>
          </Column>
          <Column>
            <Form.Item
              label="RouterID"
              desc="Local router ID, which is usually set to the IP address of the master NIC of the Kubernetes master node. If this field is not specified, the first IP address of the node where openelb-manager is located will be used."
            >
              <Input name="spec.routerId" />
            </Form.Item>
          </Column>
        </Columns>
      </Form>
    )
  }
}

export default BgpConfSettings