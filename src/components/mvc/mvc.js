/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 05/06/2017
 * Time: 14:40
 */
(() => {
  return {
    data(){
      const ide = this.closest('appui-ide-editor');
      let path      = this.source.url.substring(this.source.repository.length+1).replace('/_end_', '').split('/'),
          filename  = path.pop(),
          tabs      = ide.repositories[this.source.repository].tabs,
          exts      = [],
          tabsMenu  = {},
          //list block code for testing
          listCodes = [{ //tab controller
            type: "php",
            codes: {
              foreach: "foreach (array_expression as $key => $value){\n" + " statement" + "\n};",
              cout: "count();"
            }
          }, { //tab private
            type: "private",
            codes: {
              if: "if (expr){\n" + "  statement\n}",
              switch_Case: "switch ($variable) {\n" +
                "  case 0: \n " +
                "    statement\n" +
                "     break;\n" +
                "  case 1:\n" +
                "    statement\n" +
                "    break;\n " +
                " default:\n" +
                "    statement\n}"
            }
          }, { //tab model
            type: "model",
            codes: {
              $model: "$model->",
              $model_data: "$model->data[]",
              $model_inc: "$model->inc->"
            }
          }, { //tab view
            type: "html",
            codes: {
              bbn_input: '<bbn-input v-model=""></bbn-input>',
              bbn_numeric: '<bbn-numeric v-model=""></bbn-numeric>',
              component: '<component is=""></component>',
              div: '<div></div>'
            },
          }, { //tab javascript
            type: "js",
            codes: {
              VueStructure: "(() => {\n" +
                "  return{\n" +
                "    mixins:[],\n" +
                "    props:{},\n" +
                "    data(){\n" +
                "      return{}\n" +
                "    },\n" +
                "    computed:{},\n" +
                "    methods:{},\n" +
                "    watch:{},\n" +
                "    created(){},\n" +
                "    mounted(){},\n" +
                "    components:{}\n" +
                "  }\n" +
                "})();",
              function_arrow: "()=>{}",
              for_in: "for(let variable in variable){}",
              for_of: "for(let variable of variable){}",
              forEach: "array.forEach((item, id)=>{\n" + "});",
              arrayFilter: "array.filter(()=>{\n" +
                "   return  condition \n" + "});"
            }
          }, { //tab css
            type: "css",
            codes: {
              class: "class{\n" + "}",
              backgroundColor: "background-color:"
            }
          }
          ];

      bbn.fn.each(tabs, (tab, i) => {
        exts = [];
        // we consider only those with more than one extension
        if ( tab.extensions.length > 1 ){
          for ( let id in tab.extensions ){
            let ext = tab.extensions[id].ext;
            exts.push({
              icon: 'nf nf-fa-cogs',
              text: bbn._('switch to') + ' <strong>' + ext + '</strong>',
              key: ext,
              action: this.changeExtension
            });
          }
          tabsMenu[i] = exts;
        }
      });
      //return $.extend({}, this.source, {
      return bbn.fn.extend({}, this.source, {
        repositories: ide.repositories,
        font: ide.font,
        font_size: ide.font_size,
        theme: ide.theme,
        root: ide.source.root,
        //root: ide.prefix+'/',
        path: path.join('/'),
        filename: filename,
        tabsMenu: tabsMenu,
        permissions: ide.permFile,
        codesBlock: listCodes,
        tabsRepository: this.source.repository_content.tabs['mvc'] !== undefined ? this.source.repository_content.tabs['mvc'][0] : this.source.repository_content.tabs,
        routerSource: []
      });
    },
    computed: {
      /*routerSource(){
        if ( (this.tabsRepository !== undefined) && (this.emptyTabs !== undefined) && (this.sctrl.length) ){
          let ctrlRepo = this.tabsRepository[bbn.fn.search(this.tabsRepository, 'url' ,'_ctrl')];
          let r = [{
            load: true,
            cached: false,
            title: this.titleTabCtrl,
            bcolor: ctrlRepo.bcolor,
            fcolor: ctrlRepo.fcolor,
            menu: this.listCtrls(),
            url: this.countCtrl
          }, {
            load: true,
            url: "settings",
            disabled: !this.source.settings,
            title: bbn._("Settings"),
            icon: "nf nf-fa-cogs"
          }];
          bbn.fn.each(this.tabsRepository, (tab, idx) => {
            if ( tab.url !== '_ctrl' ){
              r.push({
                fixed: true,
                load: true,
                url: tab.url,
                title: tab.title,
                icon: tab.icon,
                notext: true,
                bcolor: tab.bcolor ,
                fcolor: tab.fcolor,
                cls: this.emptyTabs.indexOf(tab.url) !== -1 ? 'empty-tab' : '',
                menu: this.getMenu(tab.url)
              });
            }
          });
          return r;
        }
        return [];
      },*/
      sctrl(){
        if ( this.path.length ){
          return this.path.split('/');
        }
        return [];
      },
      disabledSetting(){
        return !this.source.settings;
      },
      titleTabCtrl(){
        return this.sctrl.length ? 'CTRL' + this.sctrl.length : 'CTRL';
      },
      countCtrl(){
        return "_".repeat(this.sctrl.length) + 'ctrl'
      },
      tabsReady(){
        return this.routerSource.length ? true : false;
      }
    },
    methods: {
      setRouterSource(){
        if ( (this.tabsRepository !== undefined) && (this.emptyTabs !== undefined) && (this.sctrl.length) ){
          let ctrlRepo =  bbn.fn.getRow(this.tabsRepository, 'url' ,'_ctrl');
          let r = [{
            fixed: true,
            load: true,
            cached: false,
            title: this.titleTabCtrl,
            bcolor: ctrlRepo.bcolor,
            fcolor: ctrlRepo.fcolor,
            menu: this.listCtrls(),
            url: this.countCtrl
          }, {
            load: true,
            url: "settings",
            title: bbn._("Settings"),
            icon: "nf nf-fa-cogs"
          }];
          bbn.fn.each(this.tabsRepository, (tab, idx) => {
            if ( tab.url !== '_ctrl' ){
              r.push({
                fixed: true,
                load: true,
                url: tab.url,
                title: tab.title,
                icon: tab.icon,
                notext: true,
                bcolor: tab.bcolor ,
                fcolor: tab.fcolor,
                cls: this.emptyTabs.indexOf(tab.url) !== -1 ? 'empty-tab' : '',
                menu: this.getMenu(tab.url)
              });
            }
          });
          return r;
        }
        return [];
      },
      search: bbn.fn.search,
      listCtrls(){
        let path = "",
            url  = "_ctrl",
            arr  = [{
              text: 'CTRL: ./',
              title: 'CTRL',
              icon: 'nf nf-fa-cogs',
              url: url,
              action: (a) => {
                this.loadCtrl(a);
              }
            }];
        this.sctrl.forEach((val, i) => {
          path += val + "/";
          arr.push({
            text: `CTRL${(i + 1)}:   ${path}`,
            title: `CTRL${(i + 1)}`,
            icon: 'nf nf-fa-cogs',
            scrollable: false,
            url: "_".repeat(i + 1) + url,
            action: (a) => {
              this.loadCtrl(a);
            }
          });
        });
        return arr;
      },
      loadCtrl(ctrl){
        let i   = this.getRef('tabstrip').selected,
            tab = this.getRef('tabstrip').views.splice(0, 1),
            val = tab[0].menu[ctrl - 1];
        this.getRef('tabstrip').selected = '';
        this.getRef('tabstrip').add({
          load: true,
          fixed: true,
          url: val.url,
          bcolor: tab[0].bcolor,
          fcolor: tab[0].fcolor,
          title: val.title,
          scrollable: false,
          menu: tab[0].menu.slice()
        }, i);
        this.$nextTick(() => {
          //this.getRef('tabstrip').selected = i;
          this.getRef('tabstrip').load(this.getRef('tabstrip').parseURL(url), true);
        });
      },
      //used in the template, returns a copy of the complete menu that will later be retracted in the tabLoaded event with the 'loading tab' function
      getMenu(url){
        let addCode = {
          icon: 'nf nf-fa-plus',
          text: bbn._("Add code"),
          items: []
        };
        for ( let id in this.codesBlock ){
          if ( this.codesBlock[id].type === url ){
            for ( let i in this.codesBlock[id].codes ){
              let code = this.codesBlock[id].codes[i];
              addCode.items.push({
                icon: 'nf nf-fa-code',
                text: i,
                action: () => {
                  this.addSnippet(this.codesBlock[id].codes[i])
                }
              });
            }
          }
        }
        //if no switch to extension arr arr will be an array that contains the remaining menus and specifically: the tab reload and the addition of codes
        let arr = this.tabsMenu[url] ? this.tabsMenu[url].slice() : [];
        //add reload in menu
        arr.push({
          icon: 'nf nf-fa-refresh',
          text: bbn._("Refresh code"),
          action: this.reloadTab
        })
        //add in menu the the possibility of adding the codes
        arr.push(addCode);
        return arr;
      },//method for add block of code menu sub tab
      addSnippet(addCode){
        let tab = this.getRef('tabstrip').getVue(this.getRef('tabstrip').selected);
        tab.find("bbn-code").addSnippet(addCode);
      },
      reloadTab(){
        let tab = this.getRef('tabstrip').getVue(this.getRef('tabstrip').selected);
        if ( tab.getComponent().isChanged ){
          appui.confirm(bbn._("Modified code do you want to refresh anyway?"), () => {
            this.post(this.root + 'editor/' + this.getRef('tabstrip').baseURL + tab.url, (d) => {
              if ( d.data.id ){
                tab.reload();
              }
            });
          });
        }
        else{
          this.post(this.root + 'editor/' + this.getRef('tabstrip').baseURL + tab.url, d => {
            if ( d.data.id ){
              tab.reload();
            }
          });
        }
      },
      //method change expension click of the menu subtab
      changeExtension(idx, obj){
        let code   = this.find('bbn-code'),
            tab    = this.getRef('tabstrip').getVue(this.getRef('tabstrip').selected),
            oldExt = tab.source.extension,
            newExt = obj.key;

        this.post(this.root + 'actions/change_extension', {
          newExt: newExt,
          oldExt: oldExt,
          repository: this.repositories[this.repository]['bbn_path'] + '/' + this.repositories[this.repository]['path'],
          tab: tab.url + '/',
          path: this.path,
          fileName: this.filename,
          is_mvc: this.isMVC
        }, d => {
          if ( d.success ){
            tab.deleteMenu(obj.key);
            tab.addMenu(this.getMenu(tab.url)[bbn.fn.search(this.tabsMenu[tab.url], 'key', oldExt)]);
            code.$parent.mode = newExt;
            tab.source.extension = newExt;
            tab.source.mode = newExt;
            appui.success(bbn._('Extension changed successfully'));
          }
          else{
            appui.error(bbn._('Change error extension'));
          }
        });
      },//in event tabLoadded in tab-nav
      loadingTab(data, url, tab){
        let idx = bbn.fn.search(tab.menu, 'key', data.extension);
        if ( idx > -1 ){
          tab.menu.splice(idx, 1);
        }
      }
    },
    mounted(){
      //this.closest('appui-ide-editor').urlEditor =  this.source.url ;
      this.routerSource = this.setRouterSource();
    }
  }
})();
