// Javascript Document

(() => {
  return {
    props: {
      mode: {
        type: String,
        default: "read",
      },
      infos: {
        type: Object,
        required: true
      },
      installed: {
        type: Boolean,
        required: true
      },
      lib: {
        type: String,
        required: true
      },
    },
    data() {
      return {
        viewSource: true,
        readonly: false,
        ready: false,
        test_results: "",
        addingExample: false,
        exampleCode: "",
        code: {
          'original': "",
          'current': ""
        },
        originalCode: "",
        root: appui.plugins['appui-newide'] + '/',
      }
    },
    computed: {
      visibilities() {
        return this.closest('appui-newide-cls').visibilities
      },
      types() {
        return this.closest('appui-newide-cls').types
      },
      logContent (str) {
        bbn.fn.log(str)
      },
      barButtons() {
        return [
          {
            component:'bbn-button',
            options:{
              title: "Revert",
              icon: "nf nf-mdi-restore",
              class: "bbn-bg-blue bbn-white",
              text: "Revert All Changes",
              action: () => {
                this.code.current = this.code.original;
                this.source.code = this.code.current;
              }
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
              action: this.testRun
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
                this.source.code = this.code.current;
              }
            }
          }
        ];
      }
    },
    methods: {
      renderArgName(row) {
        return '<span class="bbn-mono">$' + row.name + '</span>';
      },
      renderArgType(row) {
        return '<span class="bbn-mono">' + row.type + '</span>';
      },
      renderArgDefault(row) {
        return '<span class="bbn-mono">' + row.default + '<span/>';
      },
      onSuccess(data) {
        if (data.success) {
          appui.success("Class Successfully Updated");
        }
      },
      addExample() {
        if (this.exampleCode !== "") {
          let obj = {
            type: 'code',
            content: this.exampleCode
          };
          this.source.description_parts.push(obj);
        }
        this.addingExample = false;
      },
      deleteExample(index) {
        this.source.description_parts.splice(index, 1);
      },
      testRun() {
        let cur_tests_info = this.infos[this.source.name];
        let res = "";
        this.test_results = res;
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
        this.test_results = '<br>' + res + '<br>';
      },
      saveClass() {
      	this.isLoading = true;
        bbn.fn.post(appui.plugins['appui-newide'] + '/generating', {data: this.source, lib: this.lib,
                                                                    class: this.source.class, method: this.source.name}, d => {
          if (d.success) {
            appui.success('Class Updated successfully');
          }
          else {
            appui.error("Something went wrong");
          }
          this.isLoading = false;
        });
      }
    },
    mounted() {
      this.test_results = "";
      bbn.fn.log(this.source);
      this.code.original = this.source.code;
      this.code.current = this.source.code;
      this.$nextTick(() => this.ready = true);
    },
    watch: {
      source() {
        this.ready = false;
        setTimeout(() => {
          this.ready = true;
        }, 250)
        this.test_results = "";
        this.code.original = this.source.code;
      	this.code.current = this.source.code;
      },
      addingExample(v) {
        this.exampleCode = "";
      },
      readonly(v) {
        this.getRef("srccode").widget.setOption('readOnly', v);
        this.getRef("srccode").widget.refresh();
      }
    }
  }
})();