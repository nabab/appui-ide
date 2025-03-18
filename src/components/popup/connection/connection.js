// Javascript Document

(() => {
  return {
    data() {
      return {
        root: appui.plugins['appui-ide'] + '/',
        formSource: {
          id: this.source?.row?.id || "",
          path: this.source?.row?.path || "",
          host: this.source?.row?.host || "",
          user: this.source?.row?.user || "",
          pass: this.source?.row?.pass || "",
          text: this.source?.row?.text || "",
          type: this.source?.row?.type || "local"
        },
        type: this.source?.row?.type || "local",
        types: [{
          text: 'Local',
          value: 'local'
        }, {
          text: 'SSH',
          value: 'ssh'
        }, {
          text: 'FTP',
          value: 'ftp'
        }, {
          text: 'FTPS',
          value: 'ftps'
        }, {
          text: 'NextCloud',
          value: 'nextcloud'
        }],
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
          const container = this.closest('bbn-container');
          const cp = container.getComponent();
          if (!this.formSource.id) {
            cp.source.connections.push(d.data);
            cp.updateMenu();
          }
          else {
            const idx = bbn.fn.search(cp.source.connections, 'id', d.data.id);
            if (idx > -1) {
              cp.source.connections.splice(idx, 1, d.data);
              cp.updateMenu();
            }
          }

          appui.success();
        }
        else {
          appui.error();
        }
      }
    },
    watch: {
      type() {
        this.formSource.type = this.type;
        setTimeout(() => {
        	this.closest('bbn-floater').onResize(true);
        }, 100);
      }
    }
  }
})();