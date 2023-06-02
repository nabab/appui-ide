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
      }
    },
    data() {
      return {
        isLoading: false,
      }
    },
    methods: {
      alertResult(resp) {
        if (resp.success) {
          appui.success(bbn._("Test Environment created"));
        }
        else {
          appui.error(bbn._("Something went wrong: " + resp.error));
        }
      },
      makeEnv() {
        this.isLoading = true;
        bbn.fn.post(appui.plugins['appui-newide'] + '/data/lib_install', {class: this.source.name, lib: this.source.lib}, d => {
          this.alertResult(d);
          this.isLoading = false;
        });
      },
    },
  }
})();