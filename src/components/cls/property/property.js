// Javascript Document

(() => {
  return {
    computed: {
      visibilities() {
        return this.closest('appui-newide-cls').visibilities
      },
      types() {
        return this.closest('appui-newide-cls').types
      }
    }
  }
})();