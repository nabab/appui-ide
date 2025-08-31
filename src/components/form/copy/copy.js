// Javascript Document

(()=> {
  return {
    data() {
      return {
        root: appui.plugins['appui-ide'] + '/',
        formData: {
          name: this.source.name,
          data_src: this.source.data_src,
          data_dest: this.source.data_dest,
          url_src: this.source.url_src,
          url_dest: this.source.url_dest,
          id_project: this.source.id_project
        }
      };
    },
    computed: {

    },
    methods: {
      onSuccess(data) {
        appui.success(bbn._('Rename Successfully'));
        let nodeParent;
        if (this.source.node) {
          nodeParent = this.source.node.parent.$parent.find('bbn-tree')
        }
        if (nodeParent?.reload) {
          nodeParent.reload();
        }
        else {
          let editor = this.closest('appui-ide-editor')
          editor.treeReload();
        }
      },
      onFailure() {
        appui.error(bbn._('Rename failure'));
      }
    }
  };
})();