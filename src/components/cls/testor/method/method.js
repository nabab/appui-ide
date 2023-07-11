// Javascript Document

(() => {
  return {
    props: {
      source: {
        type: Object,
        required: true
      },
      mode: {
        type: String,
        default: "read",
      },
      lib: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        isLoading: false,
        libInstalled: false,
      }
    },
    methods: {
      alertResult(resp) {
        if (resp.success) {
          this.libInstalled = true;
          appui.success(bbn._("Test Environment created"));
        }
        else {
          this.libInstalled = false;
          appui.error(bbn._("Something went wrong: " + resp.error));
        }
      },
      makeEnv() {
        this.isLoading = true;
        bbn.fn.post(appui.plugins['appui-ide'] + '/data/lib_install', {class: this.source.name, lib: this.source.lib}, d => {
          this.alertResult(d);
          this.isLoading = false;
        });
      },
      delEnv() {
        this.isLoading = true;
        bbn.fn.post(appui.plugins['appui-ide'] + '/data/delete_install', {lib: this.source.lib}, d => {
          if (d.success) {
            this.libInstalled = false;
            appui.success(bbn._("Test Environment removed"));
          }
          else {
            appui.error(bbn._("Unable to remove Test Environment"));
          }
          this.isLoading = false;
        });
      },
    },
    mounted() {
      bbn.fn.log("mounting test method component");
      bbn.fn.log(this.lib);
      this.isLoading = true;
      bbn.fn.post(appui.plugins['appui-ide'] + '/data/check_install', {lib: this.lib}, d => {
        bbn.fn.log(d);
        if (d.success && d.found) {
          this.libInstalled = true;
        }
        else if (d.success && !d.found) {
          this.libInstalled = false;
        }
        this.isLoading = false;
      });
    },
  }
})();