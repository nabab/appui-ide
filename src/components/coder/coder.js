// Javascript Document

(() => {
  return {
    data() {
      return {
        myCode: this.source?.content,
        myTheme: "dracula",
        myMode: this.source?.ext,
        ready: false
      };
    },
    mounted() {
      if (this.closest('appui-ide-editor')) {
        this.closest('appui-ide-editor').getRecentFiles();
      }

      this.ready = true;
    },
    methods: {
      keydown(e) {
        bbn.fn.log('keydown', e);
        if (e.ctrlKey && (e.key.toLowerCase() === 's')) {
          e.preventDefault();
          e.stopImmediatePropagation();
          bbn.fn.log(this.source);
          bbn.fn.post(appui.plugins['appui-ide'] + '/editor/actions/save', {
            url: this.source.url,
            content: this.getRef("codemirror").myCode,
            id_project: this.source.id_project
          }, d => {
            bbn.fn.log(d);
            if (d.success) {
              if (d.delete) {
                appui.success(bbn._("Delete successfully"));
              }
              else {
                appui.success(bbn._("Save successfully"));
              }
            }
          });
        }
      }
    }
  };
})();
