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
                this.getPopup({
                  title: bbn._('Edit connections configuration'),
                  component: 'appui-ide-popup-connectionEditor',
                  componentOptions: {
                    source: this.source,
                  }})
              },
              icon: 'nf nf-fa-edit',
              text: bbn._("Edit"),
              key: 'a'
            }, {
              action: () => {
                // this.cp.deleteNote(this.source);
                bbn.fn.log(appui.plugins);
                this.confirm('Do you want delete ' + this.source.text + ' connection ?', () => {
                  this.post( appui.plugins['appui-ide'] + '/finder/deleteConnection', {
										id: this.source.id,
                  }, d => {
                    if (d.success) {
                      appui.success(this.source.text + ' ' + bbn._('connection successfully deleted'));
                    } else {
                      appui.error(bbn._('An error occured: ' + d.error));
                    }
                  })
                });
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