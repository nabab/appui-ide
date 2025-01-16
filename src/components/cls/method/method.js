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
      libroot: {
        type: String,
        default: ""
      },
    },
    data() {
      return {
        viewSource: true,
        readonly: this.installed ? false : true,
        ready: false,
        test_results: "",
        addingExample: false,
        exampleCode: "",
        code: {
          'original': "",
          'current': ""
        },
        originalCode: "",
        root: appui.plugins['appui-ide'] + '/',
      };
    },
    computed: {
      visibilities() {
        return this.closest('appui-ide-cls').visibilities;
      },
      types() {
        return this.closest('appui-ide-cls').types;
      },
      barButtons() {
        return [
          {
            component:'bbn-button',
            options:{
              label: "Revert",
              icon: "nf nf-md-restore",
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
              label: "Edit",
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
              label: "Refactor",
              icon: "nf nf-cod-issue_reopened",
              class: "bbn-tertiary",
              text: "Refactor",
              action: this.refactorCode
            }
          },
          {
            component:'bbn-button',
            end: true,
            options:{
              label: "Test",
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
              label: "Push",
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
      logContent (str) {
        bbn.fn.log(str);
      },
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
        bbn.fn.post(appui.plugins['appui-ide'] + '/generating', {data: this.source, lib: this.lib,
                                                                    class: this.source.class, method: this.source.name, root: this.libroot}, d => {
          if (d.success) {
            this.updateClass();
            appui.success('Class Updated successfully');
          }
          else {
            appui.error("Something went wrong");
          }
          this.isLoading = false;
        });
      },
      refactorCode() {
        bbn.fn.post(appui.plugins['appui-ide'] + '/actions/ai-refactoring', {
          lib: this.lib,
          function_code: this.code.current,
          root: this.libroot
        }, (d)=>{
          if (d.success) {
            bbn.fn.log(d.data);
            this.getPopup({
              component: 'appui-ide-cls-method-refactor',
              scrollable: true,
              source: {
                functionName: this.source.name,
                method: d.data
              },
              width: 600,
              height: "90%",
              label: bbn._("Code Refactoring"),
            });
            appui.success("Done");
          }
          else {
            appui.error("Error");
          }
        });
      },
      updateClass() {
        const classEditor = this.closest('bbn-container').closest('bbn-container').getComponent();
        classEditor.loadClass().then(() => {
          setTimeout(() => {
            const classComponent = classEditor.find('appui-ide-cls');
            const method = bbn.fn.getRow(classComponent.methodList, {value: this.source.name});
            classComponent.getRef('methodList').select(method);
          }, 1000);
        });
      },
      goBack()
      {
        //const classEditor = this.closest('bbn-container').getComponent();
        const classComponent = this.closest('appui-ide-cls');
        bbn.fn.log(classComponent);
        if (classComponent) {
          classComponent.currentMethod = "";
          classComponent.currentProps = "";
          classComponent.currentConst = "";
          classComponent.currentCode = "";
        }
      },
      getPopup() {
        return this.closest('bbn-container').getPopup(...arguments);
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
        }, 250);
        this.test_results = "";
        this.code.original = this.source.code;
      	this.code.current = this.source.code;
      },
      addingExample(v) {
        this.exampleCode = "";
      },
      readonly(v) {
        if (!this.installed && !v) {
          this.readonly = true;
        }
      }
    }
  };
})();
