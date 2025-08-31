// Javascript Document

(()=> {
  return {
    data() {
      return {
        root: appui.plugins['appui-ide'] + '/',
        name: this.source.name,
        urlRoot: this.closest('bbn-container').find('appui-ide-editor').currentRoot
      };
    },
    computed: {
      deleteSource() {
        let editor = this.closest('bbn-container').find('appui-ide-editor');
        let url = this.source.uid;
        if (editor && editor.currentTypeCode && editor.currentTypeCode === 'components') {
          url = this.source.uid.replace(this.source.name  + '/' + this.source.name, this.source.name);
        }
        url = this.urlRoot + url
        return {
          url: url.replace("//", "/"),
          id_project: this.closest('bbn-container').find('appui-project-ui').source.project.id,
          data: this.source
        };
      }
    },
    methods: {
      onSuccess(data) {
        appui.success(bbn._('Delete Successfully'));
        let nodeParent;
        if (this.source.node) {
          nodeParent = this.source.node.parent.$parent.find('bbn-tree');
        }
        
        if (nodeParent) {
          nodeParent.reload();
        } else {
          let editor = this.closest('appui-ide-editor')
          editor.treeReload();
        }
      }
    }
  };
})();