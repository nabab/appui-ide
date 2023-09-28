// Javascript Document

(() => {
  return {
    data() {
      return {
        url: appui.plugins['appui-ide'] + '/',
        code: {
          'original': "",
          'current': ""
        },
      };
    },
    computed: {
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
              title: "Refactor",
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
              title: "Push",
              icon: "nf nf-cod-bracket_dot",
              class: "bbn-state-selected",
              text: "Save",
              action: () => {
                bbn.fn.log(this.code.current !== this.source.code);
        				bbn.fn.log(this.source.code);
                this.source.code = this.code.current;
                this.source.changed = true;
                this.$forceUpdate();
                bbn.fn.log(this.source.code);
              }
            }
          }
        ];
      }
    },
    methods: {
      refactorCode() {
        bbn.fn.post(appui.plugins['appui-ide'] + '/actions/ai-refactoring', {
          lib: this.source.lib,
          function_code: this.code.current,
          root: this.source.root
        }, (d)=>{
          if (d.success) {
            bbn.fn.log(d.data);
            this.getPopup({
              component: 'appui-ide-cls-method-refactor',
              scrollable: true,
              source: {
                functionName: this.source.function,
                method: d.data
              },
              width: 600,
              height: "90%",
              title: bbn._("Code Refactoring"),
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
            const method = bbn.fn.getRow(classComponent.methodList, {value: this.formData.name});
            classComponent.getRef('methodList').select(method);
          }, 1000);
        });
      },
      confirm() {
        bbn.fn.post(
          this.url + 'data/push_modification',
          {
            lib: this.source.lib,
            root: this.source.root,
            class: this.source.class,
            libfunction: '',
            function: this.source.function,
            code: this.source.code,
          },
          (d)=>{
            if (d.success) {
              bbn.fn.log(d.data);
              this.updateClass();
              appui.success("Class successfully Updated");
            }
            else {
              appui.error(d.error);
            }
          });
      },
      getPopup() {
        return this.closest('bbn-container').getPopup(...arguments);
      }
    },
    mounted() {
      bbn.fn.log('SRC', this.source);
      this.url = appui.plugins['appui-ide'] + '/';
      this.code.original = this.source.code;
      this.code.current = this.source.code;
    },
  };
})();
