const CommonAction = {
  "resource.delete": {
    on() {
      console.log('delete me');
    }
  },
  "resource.baseinfo.edit": {
    on({ success }) {
      console.log('resource.baseinfo.edit', success());
    }
  },
  "resource.batch.delete": {
    on(props) {
      console.log('batch delete', props);
    }
  }
}

export default CommonAction