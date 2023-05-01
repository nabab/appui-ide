// Javascript Document

(() => {
  return {
    data() {
      return {
        ready: false
      }
    },
    computed: {
      visibilities() {
        return this.closest('appui-newide-cls').visibilities
      },
      types() {
        return this.closest('appui-newide-cls').types
      }
    },
    methods: {
      renderArgName(row) {
        return '<span class="bbn-mono">$' + row.name + '</span>';
      },
      renderArgType(row) {
        return '<span class="bbn-mono">' + row.type + '</span>';
      }
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