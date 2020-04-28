(() => {
  return {
    props: ['source'],
    methods: {
      insert_translation(row,idx){
        //use a different controller
        this.post(this.source.i18n + 'actions/insert_translations', {
          row: row,
          ide: true,
          id_option: this.source.id_option,
          langs: this.source.langs
        }, (d) => {
          if ( d.success ){
            appui.success('Translation saved');
            this.getRef('table').updateData();
          }
          else{
            appui.error('An error occurred while saving translation');
          }
        });
      },
    },
    computed: {
      columns(){
        return this.source.langs.map((v) => {
          return {
            field: v,
            title: bbn.fn.getField(this.source.primary, 'text', 'code', v),
            editable: true
          };
        });
      }
    },
    components: {
      /** don't hide column also if col.hidden === true */
      'toolbar': {
        template: `
          <div class="bbn-padded bbn-r">
            <span>` + bbn._("Select languages you want to hide from the table") + `:</span>
            <bbn-checkbox v-for="l in languages"
                          :key="l"
                          @change="hide_col"
                          :value="l"
                          :label="l"
                          class="bbn-hsmargin"
            ></bbn-checkbox>
            </div>`,
        props: ['source'],
        data(){
          return {
            i18n: bbn.vue.closest(this, 'appui-ide-i18n')
          }
        },
        computed: {
          languages(){
            return this.i18n.source.langs;
          },
        },
        methods: {
          hide_col(val){
            if ( val ){
              let idx = bbn.fn.search(this.i18n.getRef('table').cols, 'field', val);
              if ( idx > -1 ){
                this.i18n.getRef('table').cols[idx].hidden = !this.i18n.getRef('table').cols[idx].hidden;
                this.i18n.getRef('table').$forceUpdate();
              }
            }
          }
        }
      },
      /** expander of the table, shows the path of the files containing the string */
      'file_linker': {
        methods: {
          link_ide(){
            /** takes only the part of file name relative to the extension, +1 remove the / */
            let extension = this.source.file.slice(this.source.file.lastIndexOf('/') + 1, this.source.file.length),
                tabnavActive = bbn.vue.closest(this, 'bbn-router');
            if ( tabnavActive && extension ){
              tabnavActive.activate(extension);
            }
          },
        },
        template:
        '<ul style="width:100%; list-style-type:none; padding-left:0">' +
        '<li class="bbn-vspadded bbn-grid-fields" :source="source.file" >' +
        '<span class="bbn-lg">File:</span>' +
        '<a v-text="source.file" @click="link_ide" style="width:100%;cursor:pointer" title="Go to file"></a>' +
        ' </li>' +
        '</ul>',
        props: ['source'],

      },
    }
  }
})();
