// Javascript Document

(()=> {
  return {
    data() {
      return {
        root: appui.plugins['appui-newide'] + '/',
        renameSource: {
          url: "",
          name: "",
          id_project: this.closest('appui-project-ui').source.project.id
        }
      };
    },
    methods: {
      onSuccess(data) {
        bbn.fn.log(this.closest('appui-newide-editor'));
      }
    }
  };
})();