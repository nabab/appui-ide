/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 05/06/2017
 * Time: 14:40
 */
Vue.component('appui-ide-mvc', {
  template: '#bbn-tpl-component-appui-ide-mvc',
  props: ['source'],
  beforeMount(){
    bbn.vue.setComponentRule(this.source.root + 'components/', 'appui');
    bbn.vue.addComponent('ide/code');
    bbn.vue.unsetComponentRule();
  },
  data(){
    const ide = bbn.vue.closest(bbn.vue.closest(this, '.bbn-tabnav'), '.bbn-tab').getComponent().$data;
    let path = this.source.url.substr(this.source.repository.length).replace('/_end_', '').split('/'),
        filename = path.pop(),
        tabs = ide.repositories[this.source.repository].tabs,
        exts = [],
        tabsMenu = {};

    $.each(tabs, (i, tab) => {
      exts = [];
      // we consider only those with more than one extension
      if ( tab.extensions.length > 1 ){
        for ( let id in tab.extensions ){
          let ext = tab.extensions[id].ext;
          exts.push({
            icon: 'zmdi zmdi-refresh',
            text: "switch to " +  '<strong>' + ext + '</strong>',
            key: ext,
            command: this.changeExtension

          });
        }
        tabsMenu[i] = exts;
      }
    });
    return $.extend({}, this.source, {
      repositories: ide.repositories,
      font: ide.font,
      font_size: ide.font_size,
      theme: ide.theme,
      root: ide.root,
      path: path.join('/'),
      filename: filename,
      tabsMenu: tabsMenu,

    });
  },
  computed: {
    sctrl(){
      const vm = this;
      if ( vm.path.length ){
        return vm.path.split('/');
      }
      return [];
    }
  },
  methods:{
    //used in the template, returns a copy of the complete menu that will later be retracted in the tabLoaded event with the 'loading tab' function
    getMenu(url){
      return this.tabsMenu[url] ? this.tabsMenu[url].slice() : undefined;
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
        tab: tab.url + '/',
        path: this.path,
        fileName: this.filename,
        is_mvc: this.isMVC
      }, d=>{
        if ( d.success ){
          tab.deleteMenu(obj.key);
          tab.addMenu(this.getMenu(tab.url)[bbn.fn.search(this.tabsMenu[tab.url], 'key', oldExt)]);
          code.$parent.mode= newExt;
          tab.source.extension = newExt;
          tab.source.mode = newExt;
          appui.success(bbn._('Extension changed successfully'));
        }
        else{
          appui.error(bbn._('Change error extension'));
        }
      });
    },//in event tabLoadded in tab-nav
    loadingTab(data, url , tab){
      let idx = bbn.fn.search(tab.menu, 'key', data.extension);
      if ( idx > -1 ){
        tab.menu.splice(idx, 1);
      }
    }
  }
});
