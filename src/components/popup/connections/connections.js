// Javascript Document

(() => {
  return {
    mixins: [bbn.cp.mixins.basic],
    data() {
      return {
        root: appui.plugins["appui-ide"] + "/",
        menu: [{
          action: 'edit',
          icon: 'nf nf-fa-edit',
          text: bbn._("Edit")
        }, {
          action: 'delete' ,
          text: bbn._("Delete"),
          icon: 'nf nf-fa-trash_o'
        }]
      };
    },
    methods: {
      getToolbarButtons() {
        return [{
          icon: 'nf nf-fa-plus',
          label: bbn._('New connection'),
          action: () => {
            this.getPopup({
              label: bbn._('New connection configuration'),
              component: 'appui-ide-popup-connection'
            })
          }
        }]
      }
    },
    watch: {
      source: {
        deep: true,
        handler() {
          this.$nextTick(() => this.getRef('table').updateData());
        }
      }
    }
  }
})();
