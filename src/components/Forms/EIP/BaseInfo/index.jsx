import React from 'react'
import { observer } from 'mobx-react'
import { Form, Columns, Column, Input, TextArea } from '@kube-design/components'

const EipBaseInfo = observer(
  class EipBaseInfo extends React.Component {
    render() {
      const { formTemplate, formRef } = this.props

      return (
        <Form data={formTemplate} ref={formRef}>
          <Columns>
            <Column>
              <Form.Item
                label="Name"
                desc={
                  "The name can contain only lowercase letters, numbers, and hyphens (-), must start with a lowercase letter, and must end with a lowercase letter or number. The maximum length is 63 characters."
                }
                rules={[{ required: true, message: 'Name is required.' }]}
              >
                <Input name="metadata.name" />
              </Form.Item>
            </Column>
            <Column>
              <Form.Item
                label="Alias"
                desc={
                  "The alias can contain any characters and the maximum length is 63 characters."
                }
                rules={[{ required: true, message: 'Alias is required.' }]}
              >
                <Input name="annotations['kubesphere.io/alias']" />
              </Form.Item>
            </Column>
          </Columns>
          <Columns>
            <Column>
              <Form.Item
                label={"Description"}
                desc={
                  "The description can contain any characters and the maximum length is 256 characters."
                }
              >
                <TextArea
                  name="metadata.annotations['kubesphere.io/description']"
                  maxLength={256}
                />
              </Form.Item>
            </Column>
          </Columns>
        </Form>
      )
    }
  }
)

export default EipBaseInfo