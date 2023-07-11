// Javascript Document

(() => {
  return {
     props: {
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