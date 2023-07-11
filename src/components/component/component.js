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
      const ide = this.closest('appui-ide-editor');
      let path      = bbn.fn.substr(this.source.url, this.source.repository.length).replace('/_end_', '').split('/'),
          filename  = path.pop();
      bbn.fn.log("IDE", ide)
      path = path.join('/');
      return bbn.fn.extend({}, this.source, {
        repositories: ide.repositories,
        font: ide.font,
        font_size: ide.font_size,
        theme: ide.theme,
        root: ide.source.root,
        path: path,
        permissions: ide.permFile,
        tabsList: this.source.tabs !== undefined && this.source.tabs.length ? this.source.tabs : ide.repositories[this.source.repository].tabs,
        emptyTabs: this.source.emptyTabs,
        filename: filename
      });
    },
    mounted() {

    },
    computed: {
      routerSource(){
        return this.tabsList.map((a) => {
          return {
            load: true,
            url: a.url,
            static: true,
            icon: a.icon,
            notext: true,
            bcolor: a.bcolor,
            fcolor: a.fcolor,
            cls: this.source.emptyTabs.indexOf(a.url) !== -1 ? 'empty-tab' : '',
            menu: () => {
              this.getMenu(a.url);
            }
          };
        });
      }
    },
    methods:{
      search: bbn.fn.search,
      //for title in tabs ide
      /*renderEmptyTab(tab){
        if ( this.emptyTabs.indexOf(tab.url) !== -1 ){
          return `<i class='nf nf-plus' style='color:black;'></i>`;
        }
        return '';
      },*/
      getMenu(url){
        return [{
          icon: 'nf nf-fa-refresh',
          text: bbn._("Refresh code"),
          action: this.reloadTab
        }];
      },
      reloadTab(){
        let tn = this.$getRef('tabstrip');
        let tab = tn.getVue(tn.selected);
        if ( tab.getComponent().isChanged ){
          appui.confirm( bbn._("Modified code do you want to refresh anyway?"), ()=>{
            this.post( this.root + 'editor/' + this.getRef('tabstrip').baseURL + tab.url, (d)=>{
              if ( d.data.id ){
                tab.reload();
              }
            });
          });
        }
        else{
          this.post( this.root + 'editor/' + this.getRef('tabstrip').baseURL + tab.url, (d)=>{
            if ( d.data.id ){
              tab.reload();
            }
          });
        }
      },
      //in event tabLoadded in tab-nav
      loadingTab(data, url , tab){
        let idx = bbn.fn.search(tab.menu, 'key', data.extension);
        if ( idx > -1 ){
          tab.menu.splice(idx, 1);
        }
      }
    },
    /*mounted(){
      this.closest('appui-ide-editor').urlEditor =  this.source.url ;
    }*/
  }
})();
