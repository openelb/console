import React, { Component } from 'react'
import { Link } from "react-router-dom"
import { Icon, Tooltip } from '@kube-design/components'
import EIPStore from '../../../stores/eip'
import withList from '../../../components/HOCs/withList'
import Table from '../../../components/Tables/List'
import Banner from '../../../components/Banner'
import { ListPage } from '../../../components/HOCs/withList'
import moment from "moment"
import { trigger } from "../../../utils/action"
import styles from "./index.module.scss"
import check from "../../../assets/check.svg"
import cross from "../../../assets/cross.svg"

class List extends Component {
  get routing() {
    return this.props.rootStore.routing
  }

  get store() {
    return this.props.store
  }

  get BannerProps() {
    return {
      icon: 'eip-duotone',
      title: 'EIP',
      description:
        "OpenELB assigns IP addresses in Eip objects to LoadBalancer Services in the Kubernetes cluster."
    }
  }

  get itemActions() {
    const { tableProps } = this.props
    const [, deleteAction] = tableProps.itemActions

    return [
      {
        key: 'yaml',
        icon: 'eye',
        text: 'View YAML',
        action: 'ViewYAML',
        onClick: item =>
          this.trigger('eip.yaml.view', {
            detail: item,
            success: this.routing.query,
            store: this.store,
          }),
      },
      {
        key: 'disable',
        icon: item => item.disable ? 'start' : 'stop',
        text: item => item.disable ? 'Enable' : 'Disable',
        action: 'Disable',
        onClick: item =>
        this.trigger('eip.disable', {
          type: tableProps.name,
          detail: item,
          success: this.routing.query,
          store: this.store
        })
      },
      deleteAction,
    ]
  }

  handleCreateClick = () => {
    this.trigger('eip.create', {
      store: this.store,
      success: this.routing.query,
    })
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

          return (
            <Link to={`eip/${name}`} style={{textDecoration: 'none'}}>
              <div className={styles.cell1}>
                <Icon name='eip-duotone' size={40} />
                <div className={styles.nametexts}>
                  <div className={styles.name}>
                    <p>{name}</p>
                    {isDefault ? (<div>
                      <p>{isDefault}</p>
                    </div>) : ''}
                  </div>
                  <div className={styles.condition}>
                    <img src={record.disable ? cross : check} alt="" />
                    <p>{enabled}</p>
                  </div>
                </div>
              </div>
            </Link>)
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
          return (<div className={styles.cell}>{protocol}
            {(protocol === 'layer2')
              ? (<Tooltip content={`interface: ${record.interface}`}>
                <div className={styles.tag}>
                  <p>{record.interface}</p>
                </div>
              </Tooltip>) : ''}
          </div>)
        },
      },
      {
        title: 'Used EIP',
        dataIndex: 'usage',
        with: '19.28%',
        isHideable: true,
        render: (usage, record) => {
          return (<div>
            <div className={styles.usage}>
              <p>{usage}</p>
              Total: {record.poolSize}
            </div>
          </div>)
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
            itemActions={this.itemActions}
            searchType={'name'}
          />
        </ListPage>
      </>
    )
  }
}

export default withList({ store: new EIPStore(), module: 'eip', name: 'EIP' })(trigger(List))