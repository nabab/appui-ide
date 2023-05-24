// Javascript Document

(() => {
  return {
    props: {
      mode: {
        type: String,
        default: "read",
      }
    },
    data() {
      return {
        ready: false,
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
      formData() {
        let method = this.closest('appui-newide-cls');
        let data = method.source;
        data.methods[this.source.name] = this.source;
        return {data: data};
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
    },
    mounted() {
      this.$nextTick(() => this.ready = true);
    },
    watch: {
      source() {
        this.ready = false;
        setTimeout(() => {
          this.ready = true;
        }, 250)
      }
    }
  }
})();