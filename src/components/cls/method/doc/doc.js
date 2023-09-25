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
      logContent (str) {
        bbn.fn.log(str);
      },
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
      }
    },
    mounted() {
      this.test_results = "";
      bbn.fn.log(this.source);
      this.$nextTick(() => this.ready = true);
    },
    watch: {
      source() {
        this.ready = false;
        setTimeout(() => {
          this.ready = true;
        }, 250);
        this.test_results = "";
      },
      addingExample(v) {
        this.exampleCode = "";
      },
    }
  };
})();