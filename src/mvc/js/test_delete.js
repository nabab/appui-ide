// Javascript Document

(() => {
  return {
    data() {
      return {
        url: ""
      };
    },
    methods: {
      delete() {
        bbn.fn.post(appui.plugins['appui-newide'] + "/editor/actions/delete", {
          url: this.url,
          id_project: '8fe6e755b72611ecbc5952540000cfbe'
        }, d => {
          if (d.success) {
            appui.success(bbn._('Delete Successfully'));
          }
        });
      }
    }
  };
})();
