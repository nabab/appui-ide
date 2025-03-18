// Javascript Document

(() => {
  return {
    data() {
      return {
        root: appui.plugins["appui-ide"] + "/",
        menu: [{
          action: "edit",
          icon: 'nf nf-fa-edit',
          text: bbn._("Edit"),
          key: 'a'
        }, {
          action: "delete" ,
          text: bbn._("Delete"),
          icon: 'nf nf-fa-trash_o',
          key: 'e'
        }]
      };
    },
    methods: {
      getToolbarButtons() {
        return [{
          label: bbn._('New connection'),
          action: () => {
            this.getPopup({
              label: bbn._('New connection configuration'),
              component: 'appui-ide-popup-connection'
            })
          }
        }]
      },
      getPopup() {
        return this.closest('bbn-container').getPopup(...arguments);
      }
    },
    components: {
      menu: {
        template: `
<bbn-context :source="rowMenu">
    <span class="bbn-iblock bbn-lg bbn-hspadding">
      <i class="nf nf-md-dots_vertical"/>
  </span>
</bbn-context>`,
        props: ['source'],
        data(){
          return {
            cp: false,
            table: false
          }
        },
        computed: {
          rowMenu(){
            if (!this.table) {
              return [];
            }

            return [{
              action: () => {
                //this.cp.editNote(this.source);
              },
              icon: 'nf nf-fa-edit',
              text: bbn._("Edit"),
              key: 'a'
            }, {
              action: () => {
                // this.cp.deleteNote(this.source);
              },
              text: bbn._("Delete"),
              icon: 'nf nf-fa-trash_o',
              key: 'e'
            }];
          }
        },
        beforeMount(){
          this.table = this.closest('bbn-table');
          this.cp = this.closest('bbn-container').getComponent();
        }
      }
    }
  }
})();
