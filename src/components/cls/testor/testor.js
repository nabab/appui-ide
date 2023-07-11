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
      renderTests(row) {
        let res = "";
        if (!Object.keys(row.last_results).length) {
          return "N/A";
        }
        for (let test in row.last_results) {
          if (row.last_results[test] != null) {
            if (row.last_results[test].status == "success") {
              res += '<span class="nf nf-cod-circle_small_filled bbn-green"></span>  ';
            }
            else if (row.last_results[test].status == "failure") {
              res += '<span class="nf nf-cod-circle_small_filled bbn-orange"></span>  ';
            }
            else if (row.last_results[test].status == "skipped") {
              res += '<span class="nf nf-cod-circle_small_filled bbn-cyan"></span>  ';
            }
            else if (row.last_results[test].status == "error") {
              res += '<span class="nf nf-cod-circle_small_filled bbn-red"></span>  ';
            }
          } else {
            res += '<span class="nf nf-cod-circle_small_filled bbn-yellow"></span>  ';
          }
        }
        return res;
      },
    },
    mounted() {
      this.isLoading = true;
      bbn.fn.post(appui.plugins['appui-ide'] + '/data/check_install', {lib: this.source.lib}, d => {
        if (d.success && d.found) {
          this.libInstalled = true;
        }
        else if (d.success && !d.found) {
          this.libInstalled = false;
        }
        //this.isLoading = false;
      });
      bbn.fn.post(appui.plugins['appui-ide'] + '/data/available-tests', {class: this.source.name, lib: this.source.lib}, d => {
        if (d.success) {
          this.tests_info = d.data;
        }
        else {
          for (let method in d.data) {
            let tmp = {
              "method": d.data[method].name,
              "last_results": [],
              "test_methods": [],
              "available_tests": "N/A"
            };
            this.tests_info.push(tmp);
          }
        }
        this.isLoading = false;
        this.$nextTick(() => {
          this.getRef("table").updateData();
        });
        //bbn.fn.log("datas", this.tests_info);
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
      getInfo() {
        let res = [];
        bbn.fn.post(appui.plugins['appui-ide'] + '/data/available-tests', {class: this.source.name, lib: this.source.lib}, d => {
          if (d.success) {
            res = d.data;
          }
          else {
            for (let method in d.data) {
              let tmp = {
                "method": method.name,
                "last_results": [],
                "test_methods": [],
                "available_tests": "N/A"
              };
              res.push(tmp);
            }
          }
        });
        bbn.fn.log(res);
        return res;
      },
    },
  }
})();