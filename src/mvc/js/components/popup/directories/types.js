(() => {
  return {
    props: ['source'],
    methods:{
      renderIconExts(ele){
        return ( ele.extensions && ele.extensions.length ) ?
          '<div class="bbn-c"><i style="color: green"  class="fa fa-chevron-down"></i></div>' :
          '';
      },
      renderIconTabs(ele){
        return ( ele.tabs && ele.tabs.length ) ?
          '<div class="bbn-c"><i style="color: green" class="fa fa-chevron-down"></i></div>' :
          '';
      },
      openFormManager(){
        return this.$refs.types_table.insert({}, {
          title: bbn._('Add new type'),
          height: '95%',
          width: '85%'
        });
      },
      refreshListTypes(){
        bbn.fn.post(appui.ide.root + 'directories/data/types', d => {
          if( d.data.success ){
            this.source.types = d.data.types;
            this.$nextTick(()=>{
              this.$refs.types_table.updateData()
            });
          }
        });
      },
      deleteType(row){
        bbn.fn.confirm(bbn._("Are you sure you want to delete the") + " " + row.text  + " " + bbn._("type?"), ()=>{
          bbn.fn.post(appui.ide.root + 'directories/actions/types/delete', {id_type: row.id}, (d) => {
            if ( d.success ){
              this.refreshListTypes();
              appui.success(bbn._('Deleted'));
            }
            else {
              appui.error(bbn._("Error"));
            }
          });
        });
      },
      editType(row, col, idx){
        return this.$refs.types_table.edit(row, {
          title: bbn._('Modify type') + ' ' + row.text,
          height: '95%',
          width: '85%'
        }, idx);
      }
    }
  }
})();
