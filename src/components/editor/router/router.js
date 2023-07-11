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
        if (this.editor) {
          return bbn.fn.getRow(this.editorCfg.project.path, {'code': this.source.repository_content.code});
        }
        return null;
      },
      root() {
        return this.editor?.root;
      }
    },
    methods: {
      openHistory() {
        let component = this.closest('bbn-router');
        let url = component.views[component.selected].current;
				this.getRef('tabstrip').load('history/' + url.split('/').pop(), false);
      },
      getActive(getCode = false){
        let tn = this.getRef('tabstrip');
        bbn.fn.log("TN changed 1", tn);
        if ( tn && tn.views[tn.selected] ){
          if ( !getCode ){
            return tn;
          }
          return tn.getRealVue().find('appui-ide-code');
        }
        return false;
      },
      test() {
        let cp =  this.getActive(true);
        bbn.fn.log("CP change 1", cp);
        let component = this.closest('bbn-router');
        bbn.fn.log("COMPONENT change 1", component);
        if (this.source.isComponent && component) {
          let url = component.views[component.selected].url;
          bbn.fn.log("URL change 1", url);
          let root = '';
          bbn.fn.log("ROOT change 1", root);
          let cp = '';
          bbn.fn.log("CP change 2", cp);
          let foundComponents = false;
          bbn.fn.log("FOUNDCOMPONENTS change 1", foundComponents);
          // Removing file/ and /_end_
          let bits = url.split('/');
          bbn.fn.log("BITS change 1", bits);
          bits.splice(0, 1);
          bbn.fn.log("BITS change 2", bits);
          bits.splice(bits.length - 2, 2);
          bbn.fn.log("BITS change 3", bits);

          bbn.fn.each(bits, (a) => {
            if ( a === 'components' ){
              foundComponents = true;
              bbn.fn.log("FOUNDCOMPONENTS change 2", foundComponents);
            }
            else if ( !foundComponents ){
              root += a + '/';
              bbn.fn.log("ROOT change 2", root);
            }
            else {
              cp += a + '-';
              bbn.fn.log("CP change 3", cp);
            }
          });
          if (cp) {
            let found = false;
            bbn.fn.log("FOUND change 1", found)
            root = root.substring(0, root.length-1);
            bbn.fn.log("ROOT change 3", root);
            cp = cp.substring(0, cp.length-1);
            bbn.fn.log("CP change 4", cp);
            bbn.fn.log("ROOT", root, "CP", cp, "PREFIX", bbn.env.appPrefix);
            if ( root === 'app/main' ){
              found = bbn.env.appPrefix + '-' + cp;
              bbn.fn.log("FOUND change 4", found)
            }
            else if ( root === 'BBN_CDN_PATH/lib/bbn-vue' ){
              found = 'bbn-' + cp;
              bbn.fn.log("FOUND change 5", found)
            }
            else{
              bbn.fn.iterate(appui.plugins, (a, n) => {
                if (root.indexOf('lib/' + n) === 0) {
                  found = n + '-' + cp;
                  bbn.fn.log("FOUND change 6", found)
                  return false;
                }
              })
            }
            if ( found ){
              bbn.fn.log("FOUND HERE", found);
              bbn.version++;
              bbn.vue.unloadComponent(found);
              appui.info(bbn._("The component has been deleted") + '<br>' + bbn._("Loading a page with this component will redefine it."));
            } else {
              appui.error(bbn._("Impossible to retrieve the name of the component"));
            }
          }
        }
        else {
          if ( component.views[component.selected].settings ){
            /** @todo All this part doesmn't work */
            bbn.fn.log("THIS IS IN SETTINGS, CHECK IT IN components/editor");
            let key = this.currentURL.substring(0, this.currentURL.indexOf('_end_/')+5),
                mvc = this.findByKey(key).find('appui-ide-mvc').$data,
                pathMVC = mvc.path;
            bbn.fn.log("KEY change 1", key);
            bbn.fn.log("MVC change 1", mvc);
            bbn.fn.log("PATHMVC change 1", pathMVC);
            if ( pathMVC.indexOf('mvc/') === 0 ){
              pathMVC = pathMVC.replace("mvc/","");
              bbn.fn.log("PATHMVC change 2", pathMVC);
            }
            let link = (mvc.route ? mvc.route + '/' : '') +
                (pathMVC === 'mvc' ? '' : pathMVC + '/') +  mvc.filename;
            bbn.fn.log("BEFORE THE LINK", bbn.fn.baseName(link));
            if (bbn.fn.baseName(link) === 'index') {
              window.open(bbn.env.host + '/' + link);
            }
            else {
              appui.find('bbn-router').load(link, true);
            }
          }
          else{
            if ( component.views[component.selected].source.isMVC ){
              let pathMVC = component.views[component.selected].source.path;
              pathMVC = pathMVC.replace("mvc/","");
              let link = component.views[component.selected].source.route + pathMVC;

              bbn.fn.log("BEFORE THE LINK", bbn.fn.baseName(link));
              if (bbn.fn.baseName(link) === 'index') {
                window.open(bbn.env.host + '/' + link);
              }
              else {
                appui.find('bbn-router').load(link, true);
              }

              return true;
            }
            if ( typeof(this.find('appui-ide-coder').myMode) === 'string' ){
              switch ( this.find('appui-ide-coder').myMode ){
                case "php":
                  if ( !this.isLib ){
                    this.post(
                      this.root + "test",
                      {
                        code: this.value,
                        file: this.fullPath
                      },
                      d => {
                        const tn = this.closest('bbn-router'),
                              idx = tn.views.length;
                        tn.add({
                          title: dayjs().format('HH:mm:ss'),
                          icon: 'nf nf-fa-cogs',
                          load: false,
                          content: d.content,
                          url: 'output' + idx,
                          selected: true
                        });
                        this.$nextTick(()=>{
                          tn.route('output' + idx);
                        });
                      }
                    );
                  }
                  else{
                    this.alert(bbn._('Unable to test classes!!'));
                  }
                  break;
                case "js":
                  eval(this.value);
                  break;
                case "svg":
                  const oDocument = new DOMParser().parseFromString(this.value, "text/xml");
                  if ( (oDocument.documentElement.nodeName == "parsererror") || !oDocument.documentElement){
                    appui.alert("There is an XML error in this SVG");
                  }
                  else {
                    let divElement = document.createElement('div').innerHTML = document.importNode(oDocument.documentElement, true);
                    this.closest("bbn-container").popup(divElement.innerHTML, "Problem with SVG");
                  }
                  break;
                default:
                  appui.alert(this.value, "Test: " + this.source.mode);
              }
            }
          }
        }
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
                static: true,
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
              static: true,
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
      this.$nextTick(() => {
        bbn.fn.log("RUTER EDITOR", this.closest('appui-ide-editor'));
        this.editor = this.closest('appui-ide-editor');
        this.initRouterSource();
      })
    }
  };
})();