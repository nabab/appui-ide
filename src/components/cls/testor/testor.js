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
      methinfos: {
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
      },
      libroot: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        isLoading: false
      };
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
      },
      hasMeth()
      {
        if (Object.keys(this.methinfos).length === 0) {
          return false;
        }
        return true;
      }
    },
    methods: {
      editTestMethods()
      {
        this.getPopup({
          component: 'appui-ide-cls-testor-edit',
          scrollable: true,
          source: {
            lib: this.source.lib,
            root: this.libroot,
            class: this.source.name,
            methods: this.methinfos
          },
          width: 600,
          height: "90%",
          title: bbn._("Test Function Edition"),
        });
      },
      renderTests(row) {
        let res = "";
        if (!Object.keys(row.details).length) {
          return "N/A";
        }
        for (let test in row.details) {
          if (row.details[test] != null) {
            let title = '';
            let color = 'yellow';
            if (row.details[test].status == "success") {
              color = 'green';
            }
            else if (row.details[test].status == "failure") {
              color = 'orange';
            }
            else if (row.details[test].status == "skipped") {
              color = 'cyan';
            }
            else if (row.details[test].status == "error") {
              color = 'red';
            }
            if (row.details[test].error) {
              title = row.details[test].error;
            }
            res += '<span class="nf nf-cod-circle_small_filled bbn-' + color + (
            title ? '" title="' + bbn.fn.quotes2html(title) : ""
            ) + '"></span>  ';
          }
        }
        return res;
      },
    },
    /*mounted() {
      this.isLoading = true;
      bbn.fn.post(appui.plugins['appui-ide'] + '/data/check_install', {lib: this.source.lib}, d => {
        if (d.success && d.found) {
          this.libInstalled = true;
          bbn.fn.post(appui.plugins['appui-ide'] + '/data/available-tests', {class: this.source.name, lib: this.source.lib}, d => {
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