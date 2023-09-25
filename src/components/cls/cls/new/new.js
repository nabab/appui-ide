// Javascript Document

(() => {
  return {
    data() {
      return {
        formData: {
          root: this.source.root,
          lib: this.source.lib,
          namespace: '',
          classname: ''
        },
        root: appui.plugins['appui-ide'] + '/'
      }
    }
  }
})();