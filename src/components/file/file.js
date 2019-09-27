/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 05/06/2017
 * Time: 14:40
 */

(() => {
  return {
    data(){
      const ide = this.closest('bbn-splitter').closest('bbn-splitter').$parent.$data;
      let path     = this.source.url.substr(this.source.repository.length).replace('/_end_', '').split('/'),
          filename = path.pop(),
          tab      = ide.repositories[this.source.repository],
          extensions = false,
          exts     = [];

      // we consider only those with more than one extension
      if ( tab.extension ){
        extensions = tab.extension;
      }
      else if ( this.source.repository_content.tabs !== undefined ) {
        extensions = this.source.repository_content.tabs.lib.extensions;
      }
      else if ( this.source.repository_content.extensions !== undefined ) {
        extensions = this.source.repository_content.extensions[0]['ext'];
      }

      if ( extensions ){
        for ( let id in extensions ){
          exts.push({
            icon: 'nf nf-fa-cogs',
            text: extensions[id].ext,
            key: extensions[id].ext,
            command: this.changeExtension
          });
        }
      }
      return bbn.fn.extend(this.source, {  
        repositories: ide.repositories,
        font: ide.font,
        font_size: ide.font_size,
        theme: ide.theme,
        root: ide.root,
        path: path.join('/'),
        filename: filename,
        tabMenus: exts       
      });
    },
    methods: {
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
        let tab = this.getRef('tabstrip').getVue(this.getRef('tabstrip').selected);
        if ( tab.getComponent().isChanged ){
          appui.confirm(bbn._("Modified code do you want to refresh anyway?"), () => {
            this.post(appui.ide.root + 'editor/' + this.getRef('tabstrip').baseURL + tab.url, (d) => {
              if ( d.data.id ){
                tab.reload();
              }
            });
          });
        }
        else{
          this.post(appui.ide.root + 'editor/' + this.getRef('tabstrip').baseURL + tab.url, (d) => {
            if ( d.data.id ){
              tab.reload();
            }
          });
        }
      },
      changeExtension(idx, obj){
        let code   = bbn.vue.find(this, 'bbn-code'),
            tab    = this.getRef('tabstrip').getVue(this.getRef('tabstrip').selected),
            oldExt = tab.source.extension,
            newExt = obj.key;
        this.post(this.source.root + 'actions/change_extension', {
          newExt: newExt,
          oldExt: oldExt,
          repository: this.repositories[this.repository]['bbn_path'] + '/' + this.repositories[this.repository]['path'],
          is_mvc: this.isMVC,
          fileName: this.filename,
          path: this.path
        }, d => {
          if ( d.success ){
            tab.deleteMenu(obj.key);
            tab.addMenu(this.getMenu()[bbn.fn.search(this.tabMenus, 'key', oldExt)]);
            code.$parent.mode = newExt;
            tab.source.extension = newExt;
            tab.source.mode = newExt;
            appui.success(bbn._('Extension changed successfully'));
          }
          else{
            appui.error(bbn._('Change error extension'));
          }
        });
      }     
    }
  }
})();