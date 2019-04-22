(() => {
  let types;
  return {
    mixins: [bbn.vue.localStorageComponent],
    props: ['source'],
    methods:{
      renderIconExts(ele){
        let exts = [];
        if (ele.extensions ){
          exts = JSON.parse(ele.extensions);
        }
        return exts.length ?
          '<div class="bbn-c"><i style="color: green"  class="nf nf-fa-chevron_down"></i></div>' :
          '';
      },
      renderIconTabs(ele){
        let tabs = [];
        if (ele.tabs ){
          tabs = JSON.parse(ele.tabs);
        }
        return tabs.length ?
          '<div class="bbn-c"><i style="color: green" class="nf nf-fa-chevron_down"></i></div>' :
          '';
      },
      renderIconTypes(ele){
        let types = [];
        if (ele.types ){
          types = JSON.parse(ele.types);
        }
        return types.length ?
          '<div class="bbn-c"><i style="color: green" class="nf nf-fa-chevron_down"></i></div>' :
          '';
        // if ( (ele.types !== undefined) && ele.types.length ){
        //   return '<div class="bbn-c"><i style="color: green" class="nf nf-fa-chevron_down"></i></div>';
        // }
        // return '';
      },
      addType(){
        return this.getRef('types_table').insert({}, {
          title: bbn._('Add new type'),
          height: '95%',
          width: '85%'
        });
      },
      copyType(ele){
        alert()
        bbn.fn.log("sss", ele)
        var copyType = {
              text: '',
              code: '',
              id_parent: ele.id_parent,
              tabs: (ele.tabs && ele.tabs.length) ? ele.tabs : JSON.stringify([]),
              extensions: (ele.extensions && ele.extensions.length) ? ele.extensions : JSON.stringify([])
            },
            titlePopup = bbn._('Copy type') + " " + ele.text;
        this.closest("bbn-container").getRef('popup').open({
          height: '95%',
          width: '85%',
          title: titlePopup,
          component: 'appui-ide-popup-directories-form-types',
          source:{
            row: copyType
          }
        });
      },
      refreshListTypes(){
        bbn.fn.post(appui.ide.root + 'directories/data/types', d => {
          if( d.data.success ){
            this.source.types = d.data.types;
            this.$nextTick(()=>{
              this.getRef('types_table').updateData()
            });
          }
        });
      },
      deleteType(row){
        appui.confirm(bbn._("Are you sure you want to delete the") + " " + row.text  + " " + bbn._("type?"), ()=>{
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
        if( row.id.length ){
          if ( row.tabs && !row.extensions ){
            this.$set(row,'extensions', JSON.stringify([]));
          }
          if ( row.extensions && !row.tabs ){
            this.$set(row,'tabs', JSON.stringify([]));
          }
        }
        return this.getRef('types_table').edit(row, {
          title: bbn._('Modify type') + ' ' + row.text,
          height: '95%',
          width: '85%'
        }, idx)
      }
    }
  }
})();
