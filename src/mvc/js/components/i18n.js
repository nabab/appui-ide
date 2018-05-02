
Vue.component('appui-ide-i18n', {
  template: '#bbn-tpl-component-appui-ide-i18n',
  props: ['source'],
  data(){
    return {

    }
  },
  methods: {
    insert_translation(row,idx){
      //use a different controller
      bbn.fn.post(this.source.i18n + 'actions/insert_translations', {
        row: row,
        ide: true,
        id_option: this.source.id_option,
        langs: this.source.langs
      }, (d) => {
        if (d.success){
          appui.success('Translation saved');
          this.$refs.table.updateData();
        }
        else{
          appui.error('An error occurred while saving translation');
        }
      });
    },
  },
  computed: {
    columns(){
      let res = [];
      this.source.langs.forEach( (v, i) => {
        res.push({
          field: v,
          title: bbn.fn.get_field(this.source.primary, 'code', v, 'text'),
          editable: true
        })
      });

      return res;
    }
  },
  components: {
    'toolbar': {
      template: `
<div class="bbn-padded bbn-grid-fields"
>
 <div class="bbn-r"><?=_("Select languages you want to hide from the table")?></div>
    <div class="bbn-r">
      <div v-for="l in  languages"
           style="display: inline;"
      >
        <label v-text="l"></label>
        <bbn-checkbox :key="l"
                      style="padding-right: 3px"
                      @change="hide_col"
                      :value="l"
        ></bbn-checkbox>
      </div>
  </div>
</div>`,
      props: ['source'],
      computed: {
        languages(){
          return bbn.vue.closest(this, 'bbn-table').$parent.source.langs;
        }
      },
      methods: {
        hide_col(val){
          let table = bbn.vue.closest(this, 'bbn-table'),
              idx = bbn.fn.search(table.columns, 'field', val);
          if ( table.columns[idx].hidden === true ){
            table.columns[idx].hidden = false;
          }
          else if ( table.columns[idx].hidden === false ){
            table.columns[idx].hidden = true;
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
              tabnavActive = bbn.vue.closest(this, 'bbn-tabnav');
          bbn.fn.log(tabnavActive, extension, this.source.file)
          if ( tabnavActive && extension ){
            tabnavActive.activate(extension);
            bbn.fn.log(tabnavActive, extension)
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
});
