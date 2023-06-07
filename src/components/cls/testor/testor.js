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
        libInstalled: false,
        tests_info: [],
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
        bbn.fn.post(appui.plugins['appui-newide'] + '/data/lib_install', {class: this.source.name, lib: this.source.lib}, d => {
          this.alertResult(d);
          this.isLoading = false;
        });
      },
      delEnv() {
        this.isLoading = true;
        bbn.fn.post(appui.plugins['appui-newide'] + '/data/delete_install', {lib: this.source.lib}, d => {
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
      this.isLoading = true;
      bbn.fn.post(appui.plugins['appui-newide'] + '/data/check_install', {lib: this.source.lib}, d => {
        if (d.success && d.found) {
          this.libInstalled = true;
        }
        else if (d.success && !d.found) {
          this.libInstalled = false;
        }
        //this.isLoading = false;
      });
      bbn.fn.post(appui.plugins['appui-newide'] + '/data/available-tests', {class: this.source.name, lib: this.source.lib}, d => {
        if (d.success) {
          bbn.fn.log(d.data);
          this.tests_info = d.data;
        } else {
          alert(d.error);
        }
        this.isLoading = false;
      });
    },
    computed: {
      methodList() {
        let res = [];
        bbn.fn.iterate(this.source.methods, (a, n) => {
          res.push({
            text: (a.static ? '::' : '->') + n,
            value: n,
            summary: a.summary,
            visibility: a.visibility
          });
        });
        return res;
      },
    },
  }
})();