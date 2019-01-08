/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 05/06/2017
 * Time: 14:40
 */
(()=>{
  return{
    props: ['source'],
    data(){
      const ide = appui.ide;
      return {
        repositories: ide.repositories,
        font: ide.font,
        font_size: ide.font_size,
        theme: ide.theme,
        root: ide.root,
        permissions: ide.permFile,
        tabsList: this.source.tabs !== undefined && this.source.tabs.length ? this.source.tabs : ide.repositories[this.source.repository].tabs,
        emptyTabs: this.source.emptyTabs
      }
    },

    methods:{
      search: bbn.fn.search,
      //for title in tabs ide
      renderEmptyTab(tab){
        if ( this.emptyTabs.indexOf(tab.url) !== -1 ){
          return `<i class='zmdi zmdi-plus' style='color:black;'></i>`;
        }
        return '';
      },
      getMenu(url){
        return [{
          icon: 'zmdi zmdi-refresh',
          text: bbn._("Refresh code"),
          command: this.reloadTab
        }];
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
      //in event tabLoadded in tab-nav
      loadingTab(data, url , tab){
        console.log("dddd",data, url, tab)
        let idx = bbn.fn.search(tab.menu, 'key', data.extension);
        if ( idx > -1 ){
          tab.menu.splice(idx, 1);
        }
      }
    }
  }
})();
