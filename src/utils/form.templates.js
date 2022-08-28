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
  eip: eipFormTemplate
}

export default mapperTemplate