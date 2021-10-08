// Javascript Document

(() => {
  return {
    data() {
      return {
        root: appui.plugins['appui-ide'] + '/',
        formSource: {
          path : "",
          host : "",
          user : "",
          pass : "",
          text : "",
        },
        isTested: false,
      }
    },
    computed: {
      buttons() {
        if (this.isTested) {
          return [{
            text: bbn._("Cancel"),
            action: () => {
              this.isTested = false;
            }
          }, {
            text: bbn._("Confirm"),
            action: 'submit'
          }]
        }
        return [{
          text: bbn._("Cancel"),
          action: 'cancel'
        }, {
          text: bbn._("Test"),
          action: () => {
            if (this.$refs.form.isValid()) {
            	bbn.fn.post(this.root + 'finder/test', this.formSource, d => {
              	if (d.success !== undefined) {
                  this.isTested = d.success;
                }
            	})
            }
          }
        }]
      },
    },
    methods: {
      onSuccess(d) {
        if (d.success && d.data) {
          let container = this.closest('bbn-container');
          let cp = container.getComponent();
          cp.source.connections.push(d.data);
          cp.updateMenu();
        }
      }
    }
  }
})();