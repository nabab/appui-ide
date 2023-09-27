// Javascript Document

(() => {
  return {
    props: {
      source: {
        type: Object,
        required: true
      },
      baseUrl: {
        type: String,
        default: ""
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
      libroot: {
        type: String,
        default: ""
      },
    },
    data() {
      return {
        types: [
          'string',
          'bool',
          'int',
          'float',
          'array',
          '\\stdClass',
          'null'
        ],
       	mode: "read",
        root: appui.plugins['appui-ide'] + '/',
        visibilities: [
          {
            text: bbn._("Public"),
            value: 'public'
          }, {
            text: bbn._("Protected"),
            value: 'protected'
          }, {
            text: bbn._("Private"),
            value: 'private'
          }
        ],
        addActions: [
          {
            text: 'Add Method',
            action: () => {}
          },
          {
            text: 'Add Prop',
            action: () => {}
          },
          {
            text: 'Add Constant',
            action: () => {}
          }
        ],
        currentMethod: "",
        currentProps: "",
        currentConst: "",
        currentCode: "",
        currentMode: "",
        tabs: [
          {
						title: bbn._("Methods list"),
            notext: true,
            icon: 'nf nf-cod-symbol_method',
            fcolor: '#FFF',
            bcolor: bbn.fn.getCssVar('red'),
            url: "methods",
            static: true,
            idx: 0,
            menu: [
              {
                text: bbn._("New Method"),
                icon: 'nf nf-fa-plus',
                action: () => {
                  this.getPopup({
                    component: 'appui-ide-cls-method-new',
                    source: {
                      lib: this.source.lib,
                      root: this.libroot,
                      class: this.source.name
                    },
                    title: bbn._("New Method"),
                    width: 700,
                  });
                }
              }
            ]
          },
          {
						title: bbn._("Properties list"),
            notext: true,
            icon: 'nf nf-cod-symbol_property',
            fcolor: '#FFF',
            bcolor: bbn.fn.getCssVar('green'),
            url: "props",
            static: true,
          	idx: 1,
            menu: [
              {
                text: bbn._("New Property"),
                icon: 'nf nf-fa-plus',
                action: () => {
                  this.getPopup({
                    component: 'appui-ide-cls-property-new',
                    source: {
                      lib: this.source.lib,
                      root: this.libroot,
                      class: this.source.name
                    },
                    title: bbn._("New Property"),
                    width: 700,
                  });
                }
              }
            ]
          },
          {
						title: bbn._("Constants list"),
            notext: true,
            icon: 'nf nf-cod-symbol_constant',
            fcolor: '#FFF',
            bcolor: bbn.fn.getCssVar('blue'),
            url: "constants",
            static: true,
          	idx: 2,
            menu: [
              {
                text: bbn._("New Constant"),
                icon: 'nf nf-fa-plus',
                action: () => {
                  this.getPopup({
                    component: 'appui-ide-cls-constant-new',
                    source: {
                      lib: this.source.lib,
                      root: this.libroot,
                      class: this.source.name
                    },
                    title: bbn._("New Constant"),
                    width: 700,
                  });
                }
              }
            ]
          }
        ],
        tabSelected: 0
      }
    },
    computed: {
      currentSelected() {
        switch (this.currentMode) {
          case 'method':
            if (this.currentMethod) {
              return {
                mode: 'method',
                value: this.currentMethod
              };
            }
            break;
          case 'prop':
            if (this.currentProps) {
              return {
                mode: 'prop',
                value: this.currentProps
              };
            }
            break;
          case 'constant':
            if (this.currentConst) {
              return {
                mode: 'constant',
                value: this.currentConst
              };
            }
            break;
        }

        return null;
      },
      methodList() {
        bbn.fn.log("SRC CLS", this.source);
        let res = [];
        bbn.fn.iterate(this.source.methods, (a, n) => {
          res.push({
            text: (a.static ? '::' : '->') + n,
            value: n,
            summary: a.summary,
            visibility: a.visibility
          });
        });
        return bbn.fn.order(res, 'text');
      },
      propsList() {
        let res = [];
        bbn.fn.iterate(this.source.properties, (a, n) => {
          res.push({
            text: (a.static ? '::' : '->') + n,
            value: n,
            summary: a.summary,
            visibility: a.visibility
          });
        });
        return bbn.fn.order(res, 'text');
      },
      constList() {
        let res = [];
        bbn.fn.iterate(this.source.constants, (a, n) => {
          res.push({
            text: n,
            value: n,
            summary: a.summary,
            visibility: a.visibility
          });
        });
        return bbn.fn.order(res, 'text');
      }
    },
    methods: {
      save() {
        let method = this.find('appui-ide-cls');
        bbn.fn.post(this.root + 'generating', {
          data: method.source
        }, (d)=>{
          if (d.success) {
            appui.success("Class successfully Updated");
          }
          else {
            appui.error("Error");
          }
        });
      },
      addMethod() {
        
      }
    },
    mounted() {
      bbn.fn.log("SRC CLS", this.source);
    },
    watch: {
      currentMethod(v) {
        this.currentMode = 'method';
        this.currentCode = v ? "<?php\n" + this.source.methods[v].code : "";
      },
      currentProps(v) {
        this.currentMode = 'prop';
        //this.currentCode = v ? "<?php\n" + this.source.methods[v].code : "";
      },
      currentConst(v) {
        this.currentMode = 'constant';
        //this.currentCode = v ? "<?php\n" + this.source.methods[v].code : "";
      },
    }
  }
})();
