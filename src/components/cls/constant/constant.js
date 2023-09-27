// Javascript Document

(() => {
  return {
     props: {
      source: {
        type: Object,
        required: true
      },
      mode: {
        type: String,
        default: "read",
      }
    },
    computed: {
      visibilities() {
        return this.closest('appui-ide-cls').visibilities
      },
      types() {
        return this.closest('appui-ide-cls').types
      }
    }
  }
})();