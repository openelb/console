const bgpFormTemplate = () => ({
  apiVersion: 'network.kubesphere.io/v1alpha2',
  kind: 'BgpPeer',
  metadata: {
    name: '',
  },
  spec: {
    conf: {
      neighborAddress: '',
      localAs: 50001,
    },
    afiSafis: [
      {
        conf: {
          family: {
            afi: "AFI_IP",
            safi: "SAFI_UNICAST"
          },
          enabled: true,
        },
        addPaths: {
          config: {
            sendMax: 10,
          }
        },
      }
    ],
    nodeSelector: {
      matchLabels: {
        "openelb.kubesphere.io/rack": "",
      }
    },
  }
})

const bgpconfFormTemplate = () => ({
  apiVersion: 'network.kubesphere.io/v1alpha2',
  kind: 'BgpConf',
  metadata: {
    name: 'default',
  },
  spec: {
    as: 50000,
    listenPort: 17900,
    routerId: '',
  }
})

const eipFormTemplate = () => ({
  apiVersion: 'network.kubesphere.io/v1alpha2',
  kind: 'Eip',
  metadata: {
    name: '',
    annotation: {
      "eip.openelb.kubesphere.io/is-default-eip": false
    }
  },
  spec: {
    address: "",
    protocol: '',
    interface: '',
    disable: false,
  }
})

const mapperTemplate = {
  bgp: bgpFormTemplate,
  bgpconf: bgpconfFormTemplate,
  eip: eipFormTemplate
}

export default mapperTemplate