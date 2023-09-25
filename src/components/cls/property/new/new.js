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
        },
        root: appui.plugins['appui-ide'] + '/'
      }
    },
    methods: {
      prepare() {
        if(this.name) {
          this.formData.name = this.name;
          this.formData.code = 'public $' + this.formData.name + ';';
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
        promoted: false,
        name: '',
        code: '',
      };
    },
  }
})();