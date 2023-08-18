// Javascript Document

(() => {
  return {
    props: {
      source: {
        type: Object,
        required: true
      },
      infos: {
      	type: Object,
        required: true
    	},
      installed: {
        type: Boolean,
        required: true
      },
      mode: {
        type: String,
        default: "read",
      }
    },
    data() {
      return {
        isLoading: false
      }
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
      tableTestSource() {
        if (!this.infos) {
          return [];
        }
        return Object.values(this.infos);
      }
    },
    methods: {
      /*alertResult(resp) {
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
          bbn.fn.post(appui.plugins['appui-newide'] + '/data/available-tests', {class: this.source.name, lib: this.source.lib}, d => {
            if (d.success) {
              this.tests_info = d.data;
              if ('modified' in d) {
                this.modified = d.modified;
                bbn.fn.log(this.modified);
              }
            }
            else {
              this.tests_info = [];
              for (let method in d.data) {
                let tmp = {
                  "method": d.data[method].name,
                  "details": [],
                  "available_tests": "N/A"
                };
                this.tests_info.push(tmp);
              }
            }
            this.isLoading = false;
            this.$nextTick(() => {
              this.getRef("table").updateData();
            });
          });
        });
      },
      delEnv() {
        this.isLoading = true;
        bbn.fn.post(appui.plugins['appui-newide'] + '/data/delete_install', {lib: this.source.lib}, d => {
          if (d.success) {
            this.libInstalled = false;
            this.tests_info = null;
            this.isLoading = false;
            this.modified = {
              "status": false,
            };
            this.$nextTick(() => {
              this.getRef("table").updateData();
            });
          }
          else {
            appui.error(bbn._("Unable to remove Test Environment"));
            this.isLoading = false;
          }
        });
      },*/
      renderTests(row) {
        let res = "";
        if (!Object.keys(row.details).length) {
          return "N/A";
        }
        for (let test in row.details) {
          if (row.details[test] != null) {
            if (row.details[test].status == "success") {
              res += '<span class="nf nf-cod-circle_small_filled bbn-green"></span>  ';
            }
            else if (row.details[test].status == "failure") {
              res += '<span class="nf nf-cod-circle_small_filled bbn-orange"></span>  ';
            }
            else if (row.details[test].status == "skipped") {
              res += '<span class="nf nf-cod-circle_small_filled bbn-cyan"></span>  ';
            }
            else if (row.details[test].status == "error") {
              res += '<span class="nf nf-cod-circle_small_filled bbn-red"></span>  ';
            }
          } else {
            res += '<span class="nf nf-cod-circle_small_filled bbn-yellow"></span>  ';
          }
        }
        return res;
      },
    },
    /*mounted() {
      this.isLoading = true;
      bbn.fn.post(appui.plugins['appui-newide'] + '/data/check_install', {lib: this.source.lib}, d => {
        if (d.success && d.found) {
          this.libInstalled = true;
          bbn.fn.post(appui.plugins['appui-newide'] + '/data/available-tests', {class: this.source.name, lib: this.source.lib}, d => {
            if (d.success) {
              this.tests_info = d.data;
              if ('modified' in d) {
                this.modified = d.modified;
                bbn.fn.log(this.modified);
              }
            }
            else {
              this.tests_info = [];
              for (let method in d.data) {
                let tmp = {
                  "method": d.data[method].name,
                  "details": [],
                  "available_tests": "N/A"
                };
                this.tests_info.push(tmp);
              }
            }
            this.isLoading = false;
            this.$nextTick(() => {
              this.getRef("table").updateData();
            });
          });
        }
        else if (d.success && !d.found) {
          this.libInstalled = false;
        	this.isLoading = false;
        }
      });
    }*/
  }
})();