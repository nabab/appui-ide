// Javascript Document

(() => {
  return {
    props: {
      source: {
        type: Object,
        required: true
      },
      infos: {
      	type: Object,
        required: true
    	},
      installed: {
        type: Boolean,
        required: true
      },
      mode: {
        type: String,
        default: "read",
      },
      libroot: {
        type: String,
        default: ""
      },
    },
    computed: {
      disabled()
      {
        if (this.mode === 'read') {
          return true;
        }
        return false;
      }
    }
  };
})();
