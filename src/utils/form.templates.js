const bgpFormTemplate = () => ({
  apiVersion: 'network.kubesphere.io/v1alpha2',
  kind: 'BgpPeer',
  metadata: {
    name: '',
  },
  spec: {
    conf: {
      neighborAddress: '',
      localAs: '',
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
  eip: eipFormTemplate
}

export default mapperTemplate