// Javascript Document

(()=> {
  return {
    data() {
      return {
        root: appui.plugins['appui-newide'] + '/',
        name: this.source.name,
        urlRoot: this.closest('appui-newide-editor').currentRoot,
      };
    },
    computed: {
      renameSource() {
        let editor = this.closest('bbn-container').find('appui-newide-editor');
        let url = this.source.uid;
        if (editor && editor.currentTypeCode && editor.currentTypeCode === 'components' && this.source.is_vue) {
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
      onSuccess(data) {
        appui.success(bbn._('Rename Successfully'));
        this.closest('appui-newide-editor').nodeParent.reload();
      }
    }
  };
})();