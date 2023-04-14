// Javascript Document

(()=> {
  return {
    data() {
      return {
        root: appui.plugins['appui-newide'] + '/',
        name: this.source.name,
        urlRoot: this.closest('appui-newide-editor').currentRoot
      };
    },
    computed: {
      deleteSource() {
        let editor = this.closest('bbn-container').find('appui-newide-editor');
        let url = this.source.uid;
        if (editor && editor.currentTypeCode && editor.currentTypeCode === 'components') {
          url = this.source.uid.replace(this.source.name  + '/' + this.source.name, this.source.name);
        }
        return {
          url: this.urlRoot + url,
          id_project: this.closest('appui-project-ui').source.project.id,
          data: this.source
        };
      }
    },
    methods: {
      onSuccess(data) {
        appui.success(bbn._('Delete Successfully'));
        let editor = this.closest('appui-newide-editor')
        bbn.fn.log("NODE PARENT", editor.nodeParent);
        if (editor.nodeParent && editor.nodeParent.reload) {
          editor.nodeParent.reload();
          editor.nodeParent = null;
        } else {
          editor.treeReload();
        }
      }
    }
  };
})();