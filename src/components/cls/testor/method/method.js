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
      },
      lib: {
        type: String,
        required: true
      },
      libroot: {
        type: String,
        default: ""
      }
    },
    data() {
      return {
        test_num: 0,
        viewSource: false,
        isLoading: true,
        testFunctionsList: [],
        currentTestFunction: "",
        currentTestCode: "",
        newCode: "",
        test_results: "",
        readonly: true,
        modified: {
          "status": false,
        },
      }
    },
    computed: {
      barButtons() {
        return [
          {
            component:'bbn-button',
            options:{
              title: "Test",
              icon: "nf nf-cod-run_all",
              class: "bbn-state-selected",
              text: "Run All " + this.test_num + " Tests",
              action: () => this.testRun('all')
            }
          },
          {
            component:'bbn-button',
            options:{
              title: "New",
              icon: "nf nf-oct-diff_added",
              class: "blue",
              text: "New",
              action: this.newTest
            }
          },
          {
            component:'bbn-button',
            end: true,
            options:{
              title: "Edit",
              icon: "nf nf-fa-edit",
              class: "red",
              text: (this.readonly) ? "Edit" : "Stop Edit",
              action: () => {
                this.readonly = !this.readonly;
              }
            }
          },
          {
            component:'bbn-button',
            end: true,
            options:{
              title: "Test",
              icon: "nf nf-cod-bracket_error",
              class: "yellow",
              text: "Test",
              action: () => {
                if(this.currentTestFunction != '') {
                  this.testRun('');
                }
              }
            }
          },
          {
            component:'bbn-button',
            end: true,
            options:{
              title: "Push",
              icon: "nf nf-cod-bracket_dot",
              class: "green",
              text: "Save",
              action: () => {
                if(this.currentTestFunction != '') {
                  this.pushModification();
                }
                else {
                  this.addTest();
                }
              }
            }
          }
        ];
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
        bbn.fn.post(appui.plugins['appui-newide'] + '/data/lib_install', {class: this.source.class, lib: this.lib}, d => {
          this.alertResult(d);
          bbn.fn.post(appui.plugins['appui-newide'] + '/data/available-tests', {class: this.source.class, lib: this.lib}, d => {
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
            bbn.fn.log("datas", this.tests_info);
            this.getTestFunctionsList();
          });
        });
      },
      delEnv() {
        this.isLoading = true;
        bbn.fn.post(appui.plugins['appui-newide'] + '/data/delete_install', {lib: this.lib}, d => {
          if (d.success) {
            this.libInstalled = false;
            appui.success(bbn._("Test Environment removed"));
            bbn.fn.log("Source", this.source, "Lib", this.lib);
            bbn.fn.post(appui.plugins['appui-newide'] + '/data/available-tests', {class: this.source.class, lib: this.lib}, d => {
              if (d.success) {
                this.tests_info = d.data;
                if ('modified' in d) {
                  this.modified = d.modified;
                  bbn.fn.log(this.modified);
                }
              }
              else {
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
              bbn.fn.log("datas", this.tests_info);
              this.getTestFunctionsList();
            });
          }
          else {
            appui.error(bbn._("Unable to remove Test Environment"));
            this.isLoading = false;
          }
        });
      },
      */
      getTestFunctionsList() {
        let cur_tests_info = this.infos[this.source.name];
        bbn.fn.log("NFO", cur_tests_info);
        if (cur_tests_info) {
          this.testFunctionsList = Object.keys(cur_tests_info.details);
          this.test_num = cur_tests_info.available_tests;
        }
        else {
          this.testFunctionsList = [];
          this.test_num = 0;
        }
      },
      getTestFunctionCode() {
        if (this.source.name in this.infos) {
          let cur_tests_info = this.infos[this.source.name];
          return cur_tests_info.details[this.currentTestFunction].code;
        }
        return "";
      },
      testRun(flag) {
        let cur_tests_info = this.infos[this.source.name];
        let res = "";
        this.test_results = res;
        if (flag == "all") {
          for (let test in cur_tests_info.details) {
            if (cur_tests_info.details[test] != null) {
              if (cur_tests_info.details[test].status == "success") {
                res += '<p class="pres">' + test + ' ---> success  <span class="nf nf-cod-circle_small_filled bbn-green"></span>  </p>';
              }
              else if (cur_tests_info.details[test].status == "failure") {
                res += '<p class="pres">' + test + ' ---> failure  <span class="nf nf-cod-circle_small_filled bbn-orange"></span>  </p>';
              }
              else if (cur_tests_info.details[test].status == "skipped") {
                res += '<p class="pres">' + test + ' ---> skipped  <span class="nf nf-cod-circle_small_filled bbn-cyan"></span>  </p>';
              }
              else if (cur_tests_info.details[test].status == "error") {
                res += '<p class="pres">' + test + ' ---> error  <span class="nf nf-cod-circle_small_filled bbn-red"></span>  </p>';
              }
            } else {
              res += '<p class="pres">' + test + ' ---> result not found  <span class="nf nf-cod-circle_small_filled bbn-yellow"></span>  </p>';
            }
          }
        } else {
          if (cur_tests_info.details[this.currentTestFunction] != null) {
            if (cur_tests_info.details[this.currentTestFunction].status == "success") {
              res += '<p class="pres">' + this.currentTestFunction + ' ---> success  <span class="nf nf-cod-circle_small_filled bbn-green"></span>  </p>';
            }
            else if (cur_tests_info.details[this.currentTestFunction].status == "failure") {
              res += '<p class="pres">' + this.currentTestFunction + ' ---> failure  <span class="nf nf-cod-circle_small_filled bbn-orange"></span>  </p>';
            }
            else if (cur_tests_info.details[this.currentTestFunction].status == "skipped") {
              res += '<p class="pres">' + this.currentTestFunction + ' ---> skipped  <span class="nf nf-cod-circle_small_filled bbn-cyan"></span>  </p>';
            }
            else if (cur_tests_info.details[this.currentTestFunction].status == "error") {
              res += '<p class="pres">' + this.currentTestFunction + ' ---> error  <span class="nf nf-cod-circle_small_filled bbn-red"></span>  </p>';
            }
          } else {
            res += '<p class="pres">' + this.currentTestFunction + ' ---> result not found  <span class="nf nf-cod-circle_small_filled bbn-yellow"></span>  </p>';
          }
        }
        this.test_results = '<br>' + res + '<br>';
      },
      pushModification() {
        bbn.fn.post(appui.plugins['appui-newide'] + '/data/push_modification', {
          class: this.source.class,
          lib: this.lib,
          libfunction: this.source.name,
          function: this.currentTestFunction,
          code: this.currentTestCode,
          root: this.libroot
        }, (d)=>{
          if (d.success) {
            this.isLoading = true;
            bbn.fn.post(appui.plugins['appui-newide'] + '/data/available-tests', {class: this.source.class, lib: this.lib, root: this.libroot}, d => {
              if (d.success) {
                this.tests_info = d.data;
                if ('modified' in d) {
                  this.modified = d.modified;
                  bbn.fn.log(this.modified);
                }
              }
              else {
                this.tests_info = {};
                for (let method in d.data) {
                  let tmp = {
                    "method": d.data[method].name,
                    "details": [],
                    "available_tests": "N/A"
                  };
                  this.tests_info[d.data[method].name] = tmp;
                }
              }
              this.isLoading = false;
              bbn.fn.log('Infos', this.tests_info);
              this.getTestFunctionsList();
              this.test_results = "";
              this.readonly = true;
            });
            appui.success("Class successfully Updated");
          }
          else {
            appui.error("Error");
          }
        });
      },
      newTest() {
        this.currentTestFunction = "";
        this.newCode = "";
      },
      addTest() {
        return "";
      },
      makeSuggestion() {
        bbn.fn.post(appui.plugins['appui-newide'] + '/actions/suggest-test', {
          lib: this.lib,
          function_code: this.source.code,
          root: this.libroot
        }, (d)=>{
          if (d.success) {
            bbn.fn.log(d.data);
            appui.success("Class successfully Updated");
          }
          else {
            appui.error("Error");
          }
        });
      },
    },
    mounted() {
      this.isLoading = true;
      if (this.installed) {
        this.getTestFunctionsList();
      } else {
        this.testFunctionsList = [];
        this.test_num = 0;
      }
      this.isLoading = false;
    },
    watch: {
      currentTestFunction(v) {
        this.currentTestFunction = v;
        this.currentTestCode = this.getTestFunctionCode();
        this.test_results = "";
      },
      source(v) {
        this.getTestFunctionsList();
        this.currentTestFunction = "";
        this.currentTestCode = "";
        this.test_results = "";
        this.readonly = true;
      },
      readonly(v) {
        this.getRef("testcode").widget.setOption('readOnly', v);
        this.getRef("testcode").widget.refresh();
      }
    }
  }
})();