import CommonAction from "./base";

const Actions = {
  ...CommonAction,
  "bgp.editInfo": {
    on() {
      console.log('bgp editInfo');
    }
  }
}

export default Actions