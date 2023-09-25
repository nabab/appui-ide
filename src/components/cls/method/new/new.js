// Javascript Document

(() => {
  return {
    data() {
      return {
        name: '',
        formData: {
          root: this.source.root,
          lib: this.source.lib,
          class: this.source.class,
          name: '',
          code: '',
          line: '',
        },
        position: 'Eof',
        methods: null,
        methodsArray: [],
        curMeth: null,
        root: appui.plugins['appui-ide'] + '/'
      }
    },
    methods: {
      getMethodsInfos() {
      	const classEditor = this.closest('bbn-container').getComponent();
        const classComponent = classEditor.find('appui-ide-cls');
        const methods =  classComponent.source.methods;
        if (Object.keys(methods).length === 0) {
          this.methods = null;
        }
        else {
          this.methods = {};
          for (let method in methods) {
            let tmp = {
              "startLine": methods[method].startLine,
              "endLine": methods[method].endLine
            };
            this.methods[methods[method].name] = tmp;
          }
          this.methodsArray = Object.keys(this.methods);
          this.curMeth = this.methodsArray[0];
        }
        bbn.fn.log(this.methods);
      },
      prepare() {
        if(this.name) {
          this.formData.name = this.name;
          this.formData.code = 'public function ' + this.formData.name + '()\n{\n\n}';
          if (this.position === 'Eof') {
            this.formData.line = 'Eof';
          }
          else {
            if (this.position === 'before') {
              this.formData.line = this.methods[this.curMeth].startLine - 1;
            }
            else {
              this.formData.line = this.methods[this.curMeth].endLine + 1;
            }
          }
        }
      },
      updateClass() {
        const classEditor = this.closest('bbn-container').getComponent();
        classEditor.loadClass().then(() => {
          setTimeout(() => {
            const classComponent = classEditor.find('appui-ide-cls');
            const method = bbn.fn.getRow(classComponent.methodList, {value: this.formData.name});
            classComponent.getRef('methodList').select(method);
          }, 1000);
        });
      }
    },
    mounted() {
      this.formData = {
        root: this.source.root,
        lib: this.source.lib,
        class: this.source.class,
        name: '',
        code: '',
        line: '',
      };
      this.position = 'Eof';
      this.methodsArray = [];
      this.curMeth = null;
      this.getMethodsInfos();
    },
  }
})();