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
        let editor = this.closest('appui-ide-editor');
        if (editor.nodeParent && editor.nodeParent.reload) {
          editor.nodeParent.reload();
          editor.nodeParent = null;
        } else {
          editor.treeReload();
        }
      },
      onFailure(data) {
        appui.error(bbn._('Rename failure'));
      }
    }
  };
})();