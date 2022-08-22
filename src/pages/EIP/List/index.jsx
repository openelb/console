import React, { Component } from 'react'
import { Icon, Tooltip } from '@kube-design/components'
import EIPStore from '../../../stores/eip'
import withList from '../../../components/HOCs/withList'
import Table from '../../../components/Tables/List'
import Banner from '../../../components/Banner'
import { ListPage } from '../../../components/HOCs/withList'
import moment from "moment"
import styles from "./index.module.scss"
import done from "../../../assets/done.svg"
import failure from "../../../assets/failure.svg"

class List extends Component {
  get routing() {
    return this.props.rootStore.routing
  }

  get BannerProps() {
    return {
      icon: 'eip-duotone',
      title: 'EIP',
      description:
        "OpenELB assigns IP addresses in Eip objects to LoadBalancer Services in the Kubernetes cluster."
    }
  }

  handleCreateClick = () => {
    console.log('create')
  }

  getColumns() {
    const { getSortOrder } = this.props

    return [
      {
        title: 'Name',
        dataIndex: 'name',
        sortOrder: getSortOrder('name'),
        search: true,
        sorter: true,
        with: '21.80%',
        render: (name, record) => {
          console.log(record.default)
          let enabled
          if (record.disable) {
            enabled = 'Disabled'
          } else {
            enabled = 'Enabled'
          }

          let isDefault
          if (record.default === 'true') {
            isDefault = 'default'
          }

          return <div className={styles.cell1}>
            <Icon name='eip-duotone' size={40} />
            <div className={styles.nametexts}>
              <div className={styles.name}>
                <text>{name}</text>
                {isDefault ? <div>
                  <text>{isDefault}</text>
                </div> : ''}
              </div>
              <div className={styles.condition}>
                <img src={record.disable ? failure : done} alt="" />
                <text>{enabled}</text>
              </div>
            </div>
          </div>
        },
      },
      {
        title: 'Address',
        dataIndex: 'address',
        with: '19.28%',
        isHideable: true,
        render: (address, record) => {
          return <div>{address}</div>
        },
      },
      {
        title: 'Protocol',
        dataIndex: 'protocol',
        isHideable: true,
        with: '18.62%',
        render: (protocol, record) => {
          if (!protocol) {
            protocol = 'bgp'
          }

          return <div className={styles.cell}>{protocol}
            {(protocol === 'layer2') 
            ? <Tooltip content={`interface: ${record.interface}`}>
              <div className={styles.tag}>
                <text>{record.interface}</text>
              </div>
            </Tooltip> : ''}
          </div>
        },
      },
      {
        title: 'Used EIP',
        dataIndex: 'usage',
        with: '19.28%',
        isHideable: true,
        render: (usage, record) => {
          return <div>
            <div className={styles.usage}>
              <text>{usage}</text>
              Total: {record.poolSize}
            </div>
          </div>
        },
      },
      {
        title: 'Creation Time',
        dataIndex: 'createTime',
        sorter: true,
        sortOrder: getSortOrder('createtime'),
        isHideable: true,
        render: (createTime, record) => {
          const date = new Date(createTime)
          return <div>{moment(date).format('YYYY-MM-DD hh:mm:ss') || '-'}</div>
        },
      },
    ]
  }

  render() {
    const { tableProps } = this.props

    return (
      <>
        <Banner {...this.BannerProps} />
        <ListPage {...this.props}>
          <Table
            {...tableProps}
            columns={this.getColumns()}
            onCreate={this.handleCreateClick}
            searchType={'name'}
          />
        </ListPage>
      </>
    )
  }
}

export default withList({ store: new EIPStore(), module: 'eip' })(List)