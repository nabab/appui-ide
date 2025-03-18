// Javascript Document

(() => {
  return {
    data() {
      return {
        root: appui.plugins['appui-ide'] + '/',
        formSource: {
          path: "",
          host: "",
          user: "",
          pass: "",
          text: "",
          type: "local"
        },
        type: "local",
        types: [{text: 'Local', value: 'local'},{text:'SSH', value:'ssh'}, {text: 'FTP', value: 'ftp'}, {text: 'FTPS', value: 'ftps'}, {text: 'NextCloud', value:'nextcloud'}],
        isTested: false,
      }
    },
    computed: {
      buttons() {
        if (this.isTested) {
          return [{
            label: bbn._("Cancel"),
            action: () => {
              this.isTested = false;
            }
          }, {
            label: bbn._("Confirm"),
            action: 'submit'
          }]
        }
        return [{
          label: bbn._("Cancel"),
          action: 'cancel'
        }, {
          label: bbn._("Test"),
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
    },
    watch: {
      type() {
        bbn.fn.log('onResize');
        this.formSource.type = this.type;
        setTimeout(() => {
        	this.closest('bbn-floater').onResize(true);
        }, 100);
      }
    }
  }
})();