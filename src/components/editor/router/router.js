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
        return this.editorCfg ? bbn.fn.getRow(this.editorCfg.project.path, {'code': this.source.repository_content.code}) : null;
      },
      root() {
        return this.editor?.root || '';
      }
    },
    methods: {
      openHistory() {
        let component = this.closest('bbn-router');
        let url = component.views[component.selected].current;
				this.getRef('tabstrip').load('history/' + url.split('/').pop(), false);
      },
      getActive(getCode = false) {
        if (this.routerSource.length) {
          const ct = this.getRef('tabstrip').getFinalContainer();
          if (getCode) {
            return ct ? ct.find('appui-ide-code') : null;
          }

          return ct;
        }

        return null;
      },
      initRouterSource() {
        if (this.editorCfg) {
          if (this.source.tabs) {
            bbn.fn.log("TABS", this.source.tabs);
            this.source.tabs.forEach(tab => {
              bbn.fn.log(tab);
              this.routerSource.push({
                load: true,
                url: tab.url,
                fixed: true,
                icon: tab.icon,
                notext: true,
                bcolor: tab.bcolor,
                fcolor: tab.fcolor,
                cls: tab.file ? '' : 'empty-tab',
                menu: () => {
                  return this.getMenu(tab);
                }
              });
            });
          }
          else {
            this.routerSource.push({
              load: true,
              url: 'code',
              fixed: true,
              icon: null,
              notext: true,
              bcolor: this.repo.bcolor,
              fcolor: this.repo.fcolor,
              menu: () => {
                return this.getMenu(this.source.url);
              }
            });
          }
        }
      },
      changeExt(ext) {
        bbn.fn.log(this.source);
        bbn.fn.post(appui.plugins['appui-ide'] + '/editor/actions/change_ext', {
          url: this.source,
          ext: ext
        }, d => {
          if (d.success) {
            appui.success(bbn._("Extension change successfully"));
          }
        });
      },
      getMenu(tab){
        bbn.fn.log("getMenu", arguments);
        let menu = [{
          icon: 'nf nf-fa-refresh',
          text: bbn._("Refresh code"),
          action: this.reloadTab
        }];
        if (tab.extensions && (tab.extensions.length > 1)) {
          bbn.fn.each(tab.extensions, e => {
            let url = this.getRef('tabstrip').baseURL.split('/');
            url.shift();
            url = url.join('/');
            menu.push({
              text: bbn._('Switch to %s', e.ext),
              action: () => {
                bbn.fn.log(e);
                bbn.fn.post(appui.plugins['appui-ide'] + '/editor/actions/change_ext', {
                  url: url + tab.url,
                  ext: e.ext,
                  id_project: this.source.id_project
                }, d => {
                  if (d.success) {
                    appui.success(bbn._("Extension change successfully"));
                  }
                });
              }
            });
          });
        }
        return menu;
      },
      reloadTab(){
        let tn = this.getRef('tabstrip');
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
      this.editor = this.closest('appui-ide-editor');
      this.initRouterSource();
    }
  };
})();
