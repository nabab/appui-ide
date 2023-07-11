// Javascript Document

(() => {
  return {
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
            idx: 0
          },
          {
						title: bbn._("Properties list"),
            notext: true,
            icon: 'nf nf-cod-symbol_property',
            fcolor: '#FFF',
            bcolor: bbn.fn.getCssVar('green'),
            url: "props",
            static: true,
          	idx: 1
          },
          {
						title: bbn._("Constants list"),
            notext: true,
            icon: 'nf nf-cod-symbol_constant',
            fcolor: '#FFF',
            bcolor: bbn.fn.getCssVar('blue'),
            url: "constants",
            static: true,
          	idx: 2
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
        return res;
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
        return res;
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
      }
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