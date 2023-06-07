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
    data() {
      return {
    		read: (this.mode == "read" ? true : false),
      }
 	 },
  }
})();