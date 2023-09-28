// Javascript Document

(() => {
  return {
    data() {
      return {
        root: this.source.root,
        lib: this.source.lib,
        class: this.source.class,
        methods: [],
        nativePost: [],
        aiPost: {},
        url: appui.plugins['appui-ide'] + '/'
      };
    },
    computed: {
      canSub() {
        if (this.nativePost.length !== 0 || Object.keys(this.aiPost).length !== 0) {
          return true;
        }
        return false;
      },
      barButtons() {
        return [
          {
            component:'bbn-button',
            options:{
              title: "Suggest More",
              icon: "nf nf-md-playlist_plus",
              class: "bbn-bg-blue bbn-white",
              text: "Suggest More Tests",
              action: this.suggestMore
            }
          },
          {
            component:'bbn-button',
            end: true,
            options:{
              title: "New",
              icon: "nf nf-fa-plus_square_o",
              class: "bbn-state-selected",
              text: "Add New Test",
              action: this.addTest
            }
          },
          {
            component:'bbn-button',
            end: true,
            options:{
              title: "Confirm",
              icon: "nf nf-cod-checklist",
              class: "bbn-bg-green bbn-white",
              text: "Confirm Modifications",
              action: this.confirm
            }
          },
        ];
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
            "type": 'native',
            "headerComponent": "bbn-button",
            "headerOptions": {
              "ftext": "Delete",
              "notext": true,
              "icon": "nf nf-fa-trash",
              "class": "bbn-bg-red bbn-white",
              "action": () => {
                this.removeNativeFunction(meth.functionName)
              },
            },
            "header": meth.functionName,
            "component": "appui-ide-cls-testor-codeditor",
            "scrollable": true,
            "componentOptions": {
              "mode": "purephp",
              "source": {
                lib: this.lib,
                root: this.root,
                class: this.class,
                function: meth.functionName,
                code: meth.functionString,
                button: false,
                changed: false,
              },
            }
          };
          this.methods.push(tmp);
        }
        bbn.fn.log(this.methods);
      },
      setPanelBarColors()
      {
        this.$el.querySelectorAll('.bbn-panelbar-bbn-header').forEach((ele, i) => {
          if (this.methods[i].type === 'native') {
            ele.style.color = '#6D9ECF';
            //ele.style.backgroundColor = '#242424';
          }
          else if (this.methods[i].type === 'ai') {
            ele.style.color = '#36D4C7';
            //ele.style.backgroundColor = '#292929';
          }
        });
      },
      suggestMore()
      {
        bbn.fn.post(appui.plugins['appui-ide'] + '/actions/suggest-test', {
          lib: this.source.lib,
          function_code: this.source.function_code,
          root: this.source.root
        }, (d)=>{
          if (d.success) {
            bbn.fn.log(d.data);
            for (let method in d.data || []) {
              let meth = d.data[method];
              bbn.fn.log("METH", meth);
              let tmp = {
                "type": 'ai',
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
            appui.success("New suggestions fetched");
          }
          else {
            appui.error("Failed to Fetch suggestions");
          }
        });
      },
      removeFunction(name) {
        let idx = bbn.fn.search(this.methods, {header: name});
        if (idx !== -1) {
          this.methods.splice(idx, 1);
        }
      },
      removeNativeFunction(name) {
        let idx = bbn.fn.search(this.methods, {header: name});
        if (idx !== -1) {
          let meth = this.methods[idx].componentOptions.source;
          let post = {
            lib: meth.lib,
            root: meth.root,
            class: meth.class,
            function: meth.function,
            libfunction: this.source.libfunction,
            code: '',
          };
          this.nativePost.push(post);
          this.methods.splice(idx, 1);
        }
      },
      updateClass() {
        const classEditor = this.closest('bbn-container').closest('bbn-container').getComponent();
        classEditor.loadClass().then(() => {
          setTimeout(() => {
            const classComponent = classEditor.find('appui-ide-cls');
            const method = bbn.fn.getRow(classComponent.methodList, {value: this.source.current});
            classComponent.getRef('methodList').select(method);
          }, 1000);
        });
      },
      prepareSources()
      {
        for (let idx in this.methods) {
          let meth = this.methods[idx];
          if (meth.type === 'ai') {
            this.aiPost[meth.header] = {
              name: meth.header,
              code: meth.componentOptions.source.code
            };
          }
          else if (meth.type === 'native' && meth.componentOptions.source.changed) {
            let post = {
              lib: meth.componentOptions.source.lib,
              root: meth.componentOptions.source.root,
              class: meth.componentOptions.source.class,
              function: meth.componentOptions.source.function,
              libfunction: this.source.libfunction,
              code: meth.componentOptions.source.code,
            };
            this.nativePost.push(post);
          }
        }
      },
      confirm() {
        this.prepareSources();
        if (this.canSub) {
          bbn.fn.log('NATIVE', this.nativePost);
          bbn.fn.log('AI', this.aiPost);
          if (this.nativePost.length !== 0) {
            appui.info('Preparing to modify existing test methods');
            for (let i in this.nativePost) {
              let post = this.nativePost[i];
              bbn.fn.post(this.url + 'data/push_modification', post, (d)=>{
                if (d.success) {
                  appui.success("Modified.")
                }
                else {
                  appui.error("Error while Modifying.");
                }
              });
            }
          }
          if (Object.keys(this.aiPost).length !== 0) {
            bbn.fn.post(
              this.url + 'actions/add-test',
              {
                lib: this.lib,
                root: this.root,
                class: this.class,
                tests: this.aiPost
              },
              (d)=>{
                if (d.success) {
                  bbn.fn.log(d.data);
                  if (d.message === '') {
                    appui.success("Class successfully Updated");
                  }
                  else {
                    appui.warning(d.message);
                  }
                }
                else {
                  appui.error("Error");
                }
              });
          }
          this.updateClass();
        }
      }
    },
    mounted() {
      this.root = this.source.root;
      this.lib = this.source.lib;
      this.class = this.source.class;
      this.nativePost = [];
      this.aiPost = {};
      this.url = appui.plugins['appui-ide'] + '/';
      this.suggestions();
    },
  };
})();
