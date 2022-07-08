// Javascript Document

(() => {
  return {
    data() {
      return {
        routerSource: [],
        editor: null,
      };
    },
    computed: {
      editorCfg() {
        if (this.editor) {
          return this.editor.source;
        }
        return null;
      },
      repo() {
        return bbn.fn.getRow(this.editorCfg.project.path, {'code': this.source.repository_content.code});
      },
      root() {
        return this.editor.root;
      }
    },
    methods: {
      initRouterSource() {
        if (this.editorCfg) {
          if (this.source.tabs) {
            this.source.tabs.forEach(tab => {
              let tmp_array = tab.url.split();
              tmp_array.pop();
              let url = tmp_array.join('/') + '/' + tab.url;
              this.routerSource.push({
                load: true,
                url: url,
                static: true,
                icon: null,
                notext: true,
                bcolor: tab.bcolor,
                fcolor: tab.fcolor,
                menu: () => {
                  this.getMenu(url);
                }
              });
            });
          }
          else {
            this.routerSource.push({
              load: true,
              url: this.source.url,
              static: true,
              icon: null,
              notext: true,
              bcolor: this.repo.bcolor,
              fcolor: this.repo.fcolor,
              menu: () => {
                this.getMenu(this.source.url);
              }
            });
          }
        }
      },
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
    mounted() {
      this.editor = this.closest('appui-newide-editor');
      this.initRouterSource();
    }
  };
})();