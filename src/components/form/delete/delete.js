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
        return {
          url: this.urlRoot + this.source.name,
          id_project: this.closest('appui-project-ui').source.project.id
        };
      }
    },
    methods: {
      onSuccess(data) {
        appui.success(bbn._('Delete Successfully'));
        this.closest('appui-newide-editor').getRef('tree').reload();
      }
    }
  };
})();