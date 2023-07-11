// Javascript Document

(() => {
  return {
    props: {
      source: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        root: appui.plugins['appui-ide'] + '/',
        content: "",
        loading: false,
        mode: 'php'
      }
    },
    computed: {
      selectedListItem() {
        if (this.source?.files?.length) {
          this.selected(this.source.files[0]);
        }
        return null;
      }
    },
    methods: {
      selected(node) {
        bbn.fn.log(node);
        this.loading = true;
        this.mode = node.extension
        bbn.fn.post(this.root + 'data/content', {
          path: node.dirname + '/' + node.basename
        }, (d) => {
          if (d.success) {
            this.content = d.content;
          } else {
            appui.error(bbn._(d.error));
          }
          setTimeout(() => {
            this.loading = false;
          }, 300);
        })
      }
    },
    mounted() {
      if (this.source?.files?.length) {
          this.selected(this.source.files[0]);
        }
    }
  }
})();