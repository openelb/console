import React, { Component } from 'react'
import BGPStore from '../../../stores/bgp'
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
      icon: 'gateway-duotone',
      title: 'BGP',
      description:
        "BGP, Border Gateway Protocol, is a dynamic routing protocol that uses the TCP protocol for communication. BGP exchanges routing information between different autonomous systems (AS).",
      tips: [
        {
          title: 'What is an Autonomous System (AS)?',
          description: 'The description in progress....'
        },
        {
          title: 'How to configure local BGP properties and peer BGP properties using BgpConf and BgpPeer?',
          description: 'The description in progress....'
        },
      ]
    }
  }

  handleCreateClick = () => {
    console.log('Do you want ro create a BGP? Do it.');
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
        isHideable: true,
        render: (name, record) => {
          return <div>{name}</div>
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

export default withList({ store: new BGPStore(), module: 'bgp' })(List)