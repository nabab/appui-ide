// Javascript Document

(() => {
  return {
    data() {
      return {
        myCode: this.source.content,
        myTheme: "basicDark",
        myMode: this.source.ext,
        ready: false
      };
    },
    mounted() {
      bbn.fn.log("COMPONENTS/CODER SOURCE", this.source);
      if (!window.codemirror6) {
        bbn.fn.post(appui.plugins['appui-newide'] + '/cm6', d => {
          if (d.script) {
            eval(d.script);
            this.ready = true;
          }
        })
      }
      else {
        this.ready = true;
      }
    },
    methods: {
      keydown(e) {
        bbn.fn.log('keydown', e);
        if (e.ctrlKey && (e.key.toLowerCase() === 's')) {
          e.preventDefault();
          e.stopImmediatePropagation();
          bbn.fn.log(this.source);
          bbn.fn.post(appui.plugins['appui-newide'] + '/editor/actions/save', {
            url: this.source.url,
            content: this.myCode,
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