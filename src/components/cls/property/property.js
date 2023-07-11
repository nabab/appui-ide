// Javascript Document

(() => {
  return {
    data() {
      return {
    		read: (this.mode == "read" ? true : false),
	    }
    },
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