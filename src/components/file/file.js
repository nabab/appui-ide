/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 05/06/2017
 * Time: 14:40
 */

(() => {
  return {
    data(){
      const ide = bbn.vue.closest(bbn.vue.closest(this, '.bbn-tabnav'), '.bbns-tab').getComponent().$data;
      let path = this.source.url.substr(this.source.repository.length).replace('/_end_', '').split('/'),
          filename = path.pop(),
          tab = ide.repositories[this.source.repository],
          exts = [];

      // we consider only those with more than one extension
      if ( tab.extensions ){
        for ( let id in tab.extensions ){
          exts.push({
            icon: 'fas fa-cogs',
            text: tab.extensions[id].ext,
            key: tab.extensions[id].ext,
            command: this.changeExtension
          });
        }
      }
      return $.extend(this.source, {
        repositories: ide.repositories,
        font: ide.font,
        font_size: ide.font_size,
        theme: ide.theme,
        root: ide.root,
        path: path.join('/'),
        filename: filename,
        tabMenus: exts,
      });
    },
    methods:{
      //used in the template, returns a copy of the complete menu that will later be retracted in the tabLoaded event with the 'loading tab' function
      getMenu(){
        let arr = this.tabMenus ? this.tabMenus.slice() : [];
        arr.push({
          icon: 'zmdi zmdi-refresh',
          text: bbn._("Refresh code"),
          command: this.reloadTab
        })
        return arr
      },
      reloadTab(){
        let tab = this.$refs.tabstrip.getVue(this.$refs.tabstrip.selected);
        if ( tab.getComponent().isChanged ){
          appui.confirm( bbn._("Modified code do you want to refresh anyway?"), ()=>{
            bbn.fn.post( appui.ide.root + 'editor/' + this.$refs.tabstrip.baseURL + tab.url, (d)=>{
              if ( d.data.id ){
                tab.reload();
              }
            });
          });
        }
        else{
          bbn.fn.post( appui.ide.root + 'editor/' + this.$refs.tabstrip.baseURL + tab.url, (d)=>{
            if ( d.data.id ){
              tab.reload();
            }
          });
        }
      },
      changeExtension(idx, obj){
        let code = bbn.vue.find(this , 'bbn-code'),
            tab = this.$refs.tabstrip.getVue(this.$refs.tabstrip.selected),
            oldExt = tab.source.extension,
            newExt = obj.key;
        bbn.fn.post(this.source.root + 'actions/change_extension', {
          newExt: newExt,
          oldExt: oldExt,
          repository: this.repositories[this.repository]['bbn_path'] + '/' + this.repositories[this.repository]['path'],
          is_mvc: this.isMVC,
          fileName: this.filename
        }, d=>{
          if ( d.success ){
            tab.deleteMenu(obj.key);
            tab.addMenu(this.getMenu()[bbn.fn.search(this.tabMenus, 'key', oldExt)]);
            code.$parent.mode= newExt;
            tab.source.extension = newExt;
            tab.source.mode = newExt;
            appui.success(bbn._('Extension changed successfully'));
          }
          else{
            appui.error(bbn._('Change error extension'));
          }
        });
      },
      //in event tabLoadded in tab-nav
      loadingTab(data, url , tab){
        let idx = bbn.fn.search(tab.menu, 'key', data.extension);
        if ( idx > -1 ){
          tab.menu.splice(idx, 1);
        }
      }
    },
    mounted(){
      this.$nextTick(() => {
        $(this.$el).bbn('analyzeContent', true);
      });
    }
  }
})();