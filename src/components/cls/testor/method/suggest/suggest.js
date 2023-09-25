// Javascript Document

(() => {
  return {
    data() {
      return {
        root: this.source.root,
        lib: this.source.lib,
        class: this.source.class,
        methods: [],
        url: appui.plugins['appui-ide'] + '/'
      }
    },
    methods: {
      suggestions()
      {
        this.methods = [];
        for (let method in this.source.methods || []) {
          let meth = this.source.methods[method];
          bbn.fn.log("METH", meth);
          let tmp = {
            "headerComponent": "bbn-button",
            "headerOptions": {
              "ftext": "Delete",
              "notext": true,
              "icon": "nf nf-fa-trash",
              "class": "bbn-bg-red bbn-white",
              "action": () => {
                this.removeFunction(meth.functionName)
              },
            },
            "header": meth.functionName,
            "component": "appui-ide-cls-testor-method-codeinterface",
            "scrollable": true,
            "componentOptions": {
              "mode": "purephp",
              "source": {
                lib: this.lib,
                root: this.root,
                class: this.class,
                code: meth.functionString
              },
            }
          };
          this.methods.push(tmp);
        }
        bbn.fn.log(this.methods);
      },
      removeFunction(name) {
        let idx = bbn.fn.search(this.methods, {header: name});
        if (idx !== -1) {
          this.methods.splice(idx, 1);
        }
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
        let post = {};
        for (let method in this.methods) {
          let meth = this.methods[method];
          bbn.fn.log(meth);
          post[meth.header] = {
            name: meth.header,
            code: meth.componentOptions.source.code
          };
        }
        bbn.fn.post(
          this.url + 'actions/add-test',
          {
            lib: this.lib,
            root: this.root,
            class: this.class,
            tests: post
          },
          (d)=>{
          if (d.success) {
            bbn.fn.log(d.data);
            if (d.message === '') {
              this.updateClass();
              appui.success("Class successfully Updated");
            }
            else {
              this.updateClass();
              appui.warning(d.message);
            }
          }
          else {
            appui.error("Error");
          }
        });
      }
    },
    mounted() {
      this.root = this.source.root;
      this.lib = this.source.lib;
      this.class = this.source.class;
      this.url = appui.plugins['appui-ide'] + '/';
			this.suggestions();
    },
  }
})();