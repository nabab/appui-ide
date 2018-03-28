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
        tabsMenu = {},
        //list block code for testing
        listCodes = [{ //tab controller
            type:"php",
            codes:{
              foreach: "foreach (array_expression as $key => $value){\n" +" statement"+"\n};",
              cout: "count();"
            }
          },{ //tab private
            type:"private",
            codes:{
              if: "if (expr){\n" + "  statement\n}",
              switch_Case: "switch ($variable) {\n" +
                "  case 0: \n " +
                "    statement\n" +
                "     break;\n" +
                "  case 1:\n" +
                "    statement\n" +
                "    break;\n "+
                " default:\n" +
                "    statement\n}"
            }
          },{ //tab model
            type:"model",
            codes:{
              $model: "$model->",
              $model_data: "$model->data[]",
              $model_inc: "$model->inc->"
            }
          },{ //tab view
            type:"html",
            codes:{
              bbn_input: '<bbn-input v-model=""></bbn-input>',
              bbn_numeric : '<bbn-numeric v-model=""></bbn-numeric>',
              component: '<component is=""></component>',
              div: '<div></div>'
            },
          },{ //tab javascript
            type:"js",
            codes:{
              function_arrow: "()=>{}",
              for_in: "for(let variable in variable){}",
              for_of: "for(let variable of variable){}"
            }
          },{ //tab css
            type:"css",
            codes:{
              class: "class{\n"+"}",
              backgroundColor: "background-color:"
            }
          }
        ];

    $.each(tabs, (i, tab) => {
      exts = [];
      // we consider only those with more than one extension
      if ( tab.extensions.length > 1 ){
        for ( let id in tab.extensions ){
          let ext = tab.extensions[id].ext;
          exts.push({
            icon: 'fa fa-cogs',
            text: bbn._('switch to')  +  '<strong>' + ext + '</strong>',
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
      permissions: ide.permFile,
      codesBlock: listCodes
    });
  },
  computed: {
    sctrl(){
      const vm = this;
      if ( vm.path.length ){
        return vm.path.split('/');
      }
      return [];
    },
    disabledSetting(){
      return !this.source.settings
    }
  },
  /*mounted:{
    if ( appui.ide.settings ){
      return appui.ide.settings
    }
  }*/
  methods:{
    //used in the template, returns a copy of the complete menu that will later be retracted in the tabLoaded event with the 'loading tab' function
    getMenu(url){
      let addCode = {
          icon: 'fa fa-plus',
          text: bbn._("Add code"),
          items:[]
        };
      for( let id in this.codesBlock ){
        if ( this.codesBlock[id].type === url ){
          for ( let i in this.codesBlock[id].codes ){
            let code = this.codesBlock[id].codes[i];
            addCode.items.push({
              icon: 'fa fa-code',
              text: i,
              command: () =>{
                this.addSnaipet(this.codesBlock[id].codes[i])
              }
            });
          }
        }
      }
      //if no switch to extension arr arr will be an array that contains the remaining menus and specifically: the tab reload and the addition of codes
      let arr =  this.tabsMenu[url] ? this.tabsMenu[url].slice() : [];
      //add reload in menu
      arr.push({
        icon: 'zmdi zmdi-refresh',
        text: bbn._("Refresh code"),
        command: this.reloadTab
      })
      //add in menu the the possibility of adding the codes
      arr.push(addCode);
      return arr;
    },//method for add block of code menu sub tab
    addSnaipet(addCode){
      let tab = this.$refs.tabstrip.getVue(this.$refs.tabstrip.selected),
          code = bbn.vue.find(tab, "bbn-code"),
          state = code.getState(),
          position = {
            line: state.line,
            ch: state.char
          };
      code.widget.replaceRange("\n" + addCode + "\n", position);
    },
    reloadTab(){
      let tab = this.$refs.tabstrip.getVue(this.$refs.tabstrip.selected);
      if ( tab.getComponent().isChanged ){
        bbn.fn.confirm( bbn._("Modified code do you want to refresh anyway?"), ()=>{
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
    //method change expension click of the menu subtab
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
