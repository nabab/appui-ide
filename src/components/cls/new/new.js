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
    },
    methods: {
      updateClasses() {
        const ct = this.closest('bbn-container');
        if (ct) {
          const cp = ct.getComponent();
          const dd = cp.getRef('classesList');
          dd.updateData().then(
            () => {
              cp.currentClass = this.formData.namespace + '\\' + this.formData.classname;
            }
          );
        }
      }
    }
  }
})();