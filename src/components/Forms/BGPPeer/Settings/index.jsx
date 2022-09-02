import React from 'react'
import { observer } from 'mobx-react'
import { Form, Columns, Column, Input } from '@kube-design/components'

const SendMaxDesc = "Maximum number of equivalent routes that OpenELB can send to the peer BGP router for Equal-Cost Multi-Path (ECMP) routing. The default value is 10."

class BgpPeerSettings extends React.Component {

  render() {
    const { formRef, formTemplate } = this.props

    return (
      <Form data={formTemplate} ref={formRef}>
        <Columns>
          <Column>
            <Form.Item
              label="Peer AS"
              rules={[{ required: true, message: 'Peer AS is required.' }]}
            >
              <Input name="spec.conf.peerAs" type="number" />
            </Form.Item>
          </Column>
          <Column>
            <Form.Item
              label="Neighbor Address"
              rules={[{ required: true, message: 'Neighbor Address is required.' }]}
            >
              <Input name="spec.conf.neighborAddress" />
            </Form.Item>
          </Column>
        </Columns>
        <Columns>
          <Column>
            <Form.Item
              label="SendMax"
              desc={SendMaxDesc}
            >
              <Input name="spec.afiSafis[0].addPaths.config.sendMax" type="number" />
            </Form.Item>
          </Column>
          <Column>
            <Form.Item
              label="BgpPeer Leaf"
            >
              <Input name="spec.nodeSelector.matchLabels['openelb.kubesphere.io/rack']" />
            </Form.Item>
          </Column>
        </Columns>
      </Form>
    )
  }
}

export default observer(BgpPeerSettings)