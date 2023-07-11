// Javascript Document

(() => {
  return {
    data() {
      return {
        isLoading: false,
        currentClass: '',
        currentLibrary: '',
        root: appui.plugins['appui-ide'] + '/',
        addActions: [
          {
            text: bbn._("New class"),
            action: () => {}
          },
          {
            text: bbn._("New trait"),
            action: () => {}
          },
          {
            text: bbn._("New interfavce"),
            action: () => {}
          }
        ],
        data: null
      }
    },
    mounted() {
      setTimeout(() => {
        bbn.fn.log("CLS", this.currentClass)
      }, 250)
    },
    watch: {
      currentClass(v) {
        this.isLoading = true;
        bbn.fn.post(appui.plugins['appui-ide'] + '/class_editor', {class: v, lib: this.currentLibrary}, d => {
          this.data = d.data;
          this.isLoading = false;
        });
      }
    }
  };
})();