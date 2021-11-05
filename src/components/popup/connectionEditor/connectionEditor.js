// Javascript Document

(() => {
  return {
    data() {
      return {
        root: appui.plugins['appui-ide'] + '/',
        formSource: this.source,
        type: this.source.type ? this.source.type : "local",
        types: [{text: 'Local', value: 'local'},{text:'SSH', value:'ssh'}, {text: 'FTP', value: 'ftp'}, {text: 'FTPS', value: 'ftps'}, {text: 'NextCloud', value:'nextcloud'}],
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
        let container = this.closest('bbn-container');
        let cp = container.getComponent();
        if (d.success && d.data) {
          cp.source.connections.push(d.data);
        }
        cp.updateMenu();
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