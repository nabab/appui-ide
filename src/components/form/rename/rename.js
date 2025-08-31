// Javascript Document

(()=> {
  return {
    data() {
      return {
        root: appui.plugins['appui-ide'] + '/',
        name: this.source.name,
        urlRoot: this.closest('bbn-container').find('appui-ide-editor').currentRoot,
      };
    },
    computed: {
      renameSource() {
        let editor = this.closest('bbn-container').find('appui-ide-editor');
        let url = this.source.uid;
        if (editor && editor.currentTypeCode && editor.currentTypeCode === 'components' && this.source.isComponent) {
          url = this.source.uid.replace(this.source.name  + '/' + this.source.name, this.source.name);
        }
        return {
          url: this.urlRoot + url,
          name: this.name,
          id_project: this.closest('appui-project-ui').source.project.id,
          data: this.source
        };
      }
    },
    methods: {
      onSuccess() {
        appui.success(bbn._('Rename Successfully'));
        let nodeParent;
        if (this.source.node) {
          nodeParent = this.source.node.parent.$parent.find('bbn-tree');
        }

        if (nodeParent) {
          nodeParent.reload();
        } else {
          let editor = this.closest('appui-ide-editor');
          editor.treeReload();
        }
      }
    }
  };
})();