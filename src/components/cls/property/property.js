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
        return this.closest('appui-newide-cls').visibilities
      },
      types() {
        return this.closest('appui-newide-cls').types
      }
    }
  }
})();