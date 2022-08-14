import React, { Component } from 'react'
import EIPStore from '../../../stores/eip'
import withList from '../../../components/HOCs/withList'
import Table from '../../../components/Tables/List'
import Banner from '../../../components/Banner'
import { ListPage } from '../../../components/HOCs/withList'
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
    console.log('create');
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
        with: '21.8%',
        render: (name, record) => {
          return <div>{name}</div>
        },
      },
      {
        title: 'Address',
        dataIndex: 'address',
        with: '18.62%',
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
          return <div>{protocol}</div>
        },
      },
      {
        title: 'Used EIP',
        dataIndex: 'usage',
        with: '18.62%',
        isHideable: true,
        render: (usage, record) => {
          return <div>{usage}- total: {record.poolSize}</div>
        },
      },
      {
        title: 'Test',
        dataIndex: 'poolSize',
        with: '18.62%',
        isHideable: true,
        render: (usage, record) => {
          return <div>Render what you want</div>
        },
      },
      {
        title: 'CreateTime',
        dataIndex: 'createTime',
        sorter: true,
        sortOrder: getSortOrder('createtime'),
        isHideable: true,
        render: (createTime, record) => {
          return <div>{createTime || '-'}</div>
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