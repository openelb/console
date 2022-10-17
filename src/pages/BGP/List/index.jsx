import React, { Component } from 'react'
import moment from "moment"
import BGPStore from '../../../stores/bgp'
import withList from '../../../components/HOCs/withList'
import Table from '../../../components/Tables/List'
import Banner from '../../../components/Banner'
import { ListPage } from '../../../components/HOCs/withList'
import styles from './index.module.scss'
import connect from '../../../assets/connect-active-statusdot.svg'
import established from '../../../assets/established-statusdot.svg'
import idle from '../../../assets/idle-statusdot.svg'
import opensent from '../../../assets/opensent-confirm-statusdot.svg'
import { Button, Icon } from "@kube-design/components"
import { toJS } from "mobx"
import { trigger } from "../../../utils/action"
import { isEmpty } from "lodash"

class List extends Component {
  componentDidMount() {
    this.props.store.getConf()
  }

  get routing() {
    return this.props.rootStore.routing
  }

  get store() {
    return this.props.store
  }

  get bgpConf() {
    return toJS(this.store.conf)
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
          description: 'An autonomous system is a collection of connected Internet Protocol routing prefixes under the control of one or more network operators on behalf of a single administrative entity or domain, that presents a common and clearly defined routing policy to the Internet.'
        },
        {
          title: 'How to configure local BGP properties and peer BGP properties using BgpConf and BgpPeer?',
          description: "You can easily create BgpConf and BgpPeer resource using the Web UI and that'll configure local BGP properties and peer BGP properties."
        },
      ]
    }
  }

  get itemActions() {
    const [editInfoAction, deleteAction] = this.props.tableProps.itemActions

    return [
      editInfoAction,
      {
        key: 'yaml',
        icon: 'pen',
        text: 'Edit YAML',
        action: 'editYAML',
        onClick: item =>
          this.trigger('bgp.yaml.edit', {
            detail: item,
            success: this.routing.query,
            store: this.store,
          }),
      },
      {
        key: 'settings',
        icon: 'gateway-duotone',
        text: 'Edit BgpPeer Setting',
        action: 'editSetting',
        onClick: item =>
          this.trigger('bgp.settings.edit', {
            detail: item,
            success: this.routing.query,
            store: this.store,
          }),
      },
      deleteAction,
    ]
  }

  handleCreateClick = () => {

    this.trigger('bgp.create', {
      store: this.store,
      success: this.routing.query,
    })
  }

  handleCreateConfClick = () => {

    this.trigger('bgpconf.create', {
      store: this.store,
      success: this.routing.query,
    })
  }

  handleEditConfClick = () => {

    this.trigger('bgpconf.edit', {
      store: this.store,
      detail: this.bgpConf,
      success: this.routing.query,
    })
  }

  getColumns() {
    const { getSortOrder } = this.props

    return [
      {
        title: 'BgpPeer Name',
        dataIndex: 'name',
        sortOrder: getSortOrder('name'),
        search: true,
        sorter: true,
        isHideable: true,
        with: '17.44%',
        render: (name, record) => {
          return (<div className={styles.name}>
            <Icon name="conversion-node" size={40} />
            <div>
              <p>{name}</p>
              {record.description}
            </div>
          </div>)
        },
      },
      {
        title: 'Status',
        dataIndex: 'status',
        isHideable: true,
        with: '9.09%',
        render: (status, record) => {
          let statusText
          let statusIcon
          switch (status) {
            case 'IDLE':
              statusText = 'Idle'
              statusIcon = idle
              break
            case 'ESTABLISHED':
              statusText = 'Established'
              statusIcon = established
              break
            case 'ACTIVE':
              statusText = 'Active'
              statusIcon = connect
              break
            case 'OPENSENT':
              statusText = 'OpenSent'
              statusIcon = opensent
              break
            case 'OPENCONFIRM':
              statusText = 'OpenConfirm'
              statusIcon = opensent
              break
            default:
              break
          }
          return (<div className={styles.status}>
            <img src={statusIcon} alt=""></img>
            <p>{statusText}</p>
          </div>)
        }
      },
      {
        title: 'Local AS',
        dataIndex: 'localAs',
        isHideable: true,
        with: '9.09%',
        render: (localAs, record) => {
          return <div>{localAs}</div>
        }
      },
      {
        title: 'Peer AS',
        dataIndex: 'peerAs',
        isHideable: true,
        with: '9.09%',
        render: (peerAs, record) => {
          return <div>{peerAs}</div>
        }
      },
      {
        title: 'Neighbor Address',
        dataIndex: 'neighborAddress',
        isHideable: true,
        with: '9.09%',
        render: (neighborAddress, record) => {
          return <div>{neighborAddress}</div>
        }
      },
      {
        title: 'Peer Type',
        dataIndex: 'peerType',
        isHideable: true,
        with: '9.09%',
        render: (peerType, record) => {
          return <div>{peerType}</div>
        }
      },
      {
        title: 'SendMax',
        dataIndex: 'sendMax',
        isHideable: true,
        with: '9.09%',
        render: (sendMax, record) => {
          return <div>{sendMax}</div>
        }
      },
      {
        title: 'BgpPeer Leaf',
        dataIndex: 'bgpPeerLeaf',
        isHideable: true,
        with: '9.09%',
        render: (bgpPeerLeaf, record) => {
          return <div>{bgpPeerLeaf}</div>
        }
      },
      {
        title: 'Creation Time',
        dataIndex: 'createTime',
        isHideable: true,
        with: '10.17%',
        render: (createTime, record) => {
          const date = new Date(createTime)
          return <div>{moment(date).format('YYYY-MM-DD hh:mm:ss') || '-'}</div>
        }
      }
    ]
  }

  renderBgpConfEmpty() {
    return (<div className={styles.empty}>
      <div className={styles.info}>
        <Icon name="gateway-duotone" size={40} />
        <div>
          <p>BgpConf not Created</p>
          Create a BgpConf object to configure local BGP properties on OpenELB.
        </div>
      </div>
      <Button
        type="control"
        onClick={this.handleCreateConfClick}
      >
        Create
      </Button>
    </div>)
  }

  renderBgpConf() {
    const conf = this.bgpConf

    return (isEmpty(conf) ? this.renderBgpConfEmpty() :
      (<div className={styles.bgpConf}>
        <div className={styles.frame1}>
          <div className={styles.summary}>
            <Icon name="gateway-duotone" size={40} />
            <div>
              <div>
                <p>{conf.name}</p>
                BgpConf
              </div>
              <div style={{ flexGrow: 2 }}>
                <p>{moment(new Date(conf.createTime))
                  .format('YYYY-MM-DD hh:mm:ss') || '-'}</p>
                Creation Time
              </div>
            </div>
          </div>
          <Button
            onClick={this.handleEditConfClick}>
            <p>Edit BgpConf</p>
          </Button>
        </div>

        <div className={styles.frame2}>
          <div>
            <Icon name="duotone" size={40} />
            <div>
              <p>{conf.as}</p>
              ASN
            </div>
          </div>
          <div>
            <Icon name="network-port" size={40} />
            <div>
              <p>{conf.listenPort}</p>
              ListenPort
            </div>
          </div>
          <div>
            <Icon name="lab-router" size={40} />
            <div>
              <p>{conf.routerID}</p>
              RouterID
            </div>
          </div>
        </div>

        <div className={styles.frame3}>
          <div>
            <div>
              <span>
                <div><p>{conf.nodeCount}</p></div>
              </span>
              <p>Running Nodes:</p>
            </div>
            <div>
              {conf.nodes?.map((node, index) => {
                return (<div key={index}>
                  <Icon name="nodes" size={40} />
                  <p>{node}</p>
                </div>)
              })}
            </div>
          </div>
        </div>
      </div>))
  }

  render() {
    const { tableProps } = this.props

    return (
      <>
        <Banner {...this.BannerProps} />
        {this.renderBgpConf()}
        <ListPage {...this.props}>
          <Table
            {...tableProps}
            itemActions={this.itemActions}
            columns={this.getColumns()}
            onCreate={this.handleCreateClick}
            searchType={'name'}
          />
        </ListPage>
      </>
    )
  }
}

export default withList({ store: new BGPStore(), module: 'bgp', name: 'BGP' })(trigger(List))