// Javascript Document

(() => {
  return {
    props: {
      source: {
        type: Object,
        required: true
      },
      active: {
        type: Boolean,
        default: false
      },
      index: {
        type: Number,
        required: true
      }
    },
    data(){
      return {
        cp: null
      }
    },
    created(){
      this.cp = this.closest("appui-ide-finder")
    },
    mounted() {
      this.closest("bbn-scroll").onResize(true).then(() => {
        this.cp.updateScroll();
      });
    }
  }
})();
