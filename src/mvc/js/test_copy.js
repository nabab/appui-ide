// Javascript Document

(() => {
  return {
    data() {
      return {
        src: "",
        dest: "",
        name: ""
      };
    },
    methods: {
      copy() {
        bbn.fn.post(appui.plugins['appui-newide'] + "/editor/actions/copy", {
          src: this.src,
          dest: this.dest,
          name: this.name,
          id_project: '8fe6e755b72611ecbc5952540000cfbe'
        }, d => {
          if (d.success) {
            appui.success(bbn._('Copy Successfully'));
          }
        });
      }
    }
  };
})();
