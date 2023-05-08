// Javascript Document

(() => {
  return {
    data() {
      return {
        root: appui.plugins['appui-ide'] + '/',
        formSource: this.source?.row || {
          path: "",
          host: "",
          user: "",
          pass: "",
          text: "",
          type: "local"
        },
        types: [{
          text: bbn._('Local'),
          value: 'local'
        }, {
          text: bbn._('SSH'),
          value:'ssh'
        }, {
          text: bbn._('FTP'),
          value: 'ftp'
        }, {
          text: bbn._('FTPS'),
          value: 'ftps'
        }, {
          text: bbn._('NextCloud'),
          value:'nextcloud'
        }, {
          text: bbn._('Google Drive'),
          value:'googledrive'
        }],
        isTested: false
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
            	this.post(this.root + 'finder/test', this.formSource, d => {
              	if (d.success !== undefined) {
                  this.isTested = d.success;
                }
            	})
            }
          }
        }]
      },
      hostFieldVisible(){
        switch (this.formSource.type) {
          case 'local':
          case 'googledrive':
            return false;
          default:
            return true;
        }
      },
      userFieldVisible(){
        switch (this.formSource.type) {
          case 'local':
          case 'googledrive':
            return false;
          default:
            return true;
        }
      },
      passFieldVisible(){
        switch (this.formSource.type) {
          case 'local':
          case 'googledrive':
            return false;
          default:
            return true;
        }
      }
    },
    methods: {
      onSuccess(d) {
        if (d.success && d.data) {
          let container = this.closest('bbn-container');
          let cp = container.getComponent();
          cp.source.connections.push(d.data);
          cp.updateMenu();
        }
      },
      generateGoogleDriveToken(){
        if ((this.formSource.type === 'googledrive')
          && (this.formSource.user.length)
        ) {
          this.post(this.root + 'finder/googledrive/token/generate', {
            credentials: this.formSource.user
          }, d => {
            if (d.success && d.url) {
              this.getPopup({
                content: `<iframe src="${d.url}&output=embed" referrerpolicy="no-referrer"/>`,
                width: '60%',
                height: '60%'
              })
            }
          })
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