// Javascript Document

(() => {
  return {
    methods: {
      getToolbarButtons() {
        return [{
          text: bbn._('New connection'),
          action: () => {
            this.getPopup({
              title: bbn._('New connection configuration'),
              component: 'appui-ide-popup-connection'
            })
          }
        }]
      }
    },
    components: {
      menu: {
        template: `
<bbn-context :source="rowMenu">
    <span class="bbn-iblock bbn-lg bbn-hspadded">
      <i class="nf nf-mdi-dots_vertical"/>
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