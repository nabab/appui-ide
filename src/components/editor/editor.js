(() => {
  return {
    props: {
      /**
       * The component's data.
       * @prop {Object} source
       */
      source: {
        type: Object
      },
      /**
       * The root for action editor.
       * @prop {String} [ide] type
       */
      prefix: {
        type: String,
        default: 'ide',
      },
      project: {
        type: String,
        default: 'apst-app',
      },
 		},
    data(){
      if ( this.source.repositories ){
        bbn.fn.each(this.source.repositories, (a, i) => {
          a.value = i;
        });
      }
      return {
        typeProjectReady: false,
      //  showTest: true,
        repositories: this.source.repositories,
        currentRep: '',
        selected: 0,
        url: this.source.root + 'editor',
        urlEditor: false,
        path: '',
        lastRename: '',
        searchFile: '',
        themeCode: this.source.theme,
        tempNodeofTree: false,
       // urlEditor: '',
        //for search content
        search:{
          link: false,
          all: false,
          searchElement: '',
          caseSensitiveSearch: false,
          lastSearchRepository: ''
        },
        typeProject: 'mvc',
        //for search content
        showSearchContent: false,
        menu: [{
          text: bbn._('File'),
          items: [{
            icon: 'nf nf-fa-plus',
            text: bbn._('New'),
            items: [{
              icon: 'nf nf-fa-file',
              text: bbn._('Element'),
              action: this.newElement
            }, {
              icon: 'nf nf-fa-folder',
              text: bbn._('Directory'),
              action: this.newDir
            }]
            }, {
              icon: 'nf nf-fa-save',
              text: bbn._('Save'),
              action: this.save
            }, {
              icon: 'nf nf-fa-edit',
              text: bbn._('Rename'),
              action: () => {
                this.rename(this.getRef('tabstrip')['tabs'][this.getRef('tabstrip').selected], true);
              }
            }, {
              icon: 'nf nf-fa-trash',
              text: bbn._('Delete'),
              action: this.deleteActive
            }, {
              icon: 'nf nf-fa-times_circle',
              text: bbn._('Close tab'),
              action: this.closeTab
            }, {
              icon: 'nf nf-fa-times_circle',
              text: bbn._('Close all tabs'),
              action: this.closeTabs
            }, {
              text: bbn._('Recent files'),
              icon: 'nf nf-fa-file',
              items: []
            }
          ]}, {
            text: bbn._('Edit'),
            items: [{
              icon: 'nf nf-fa-search',
              text: bbn._('Find') + ' <small>CTRL+F</small>',
              action: this.codeSearch
            }, {
              icon: 'nf nf-fa-search_plus',
              text: bbn._('Find next') + ' <small>CTRL+G</small>',
              action: this.codeFindNext
            }, {
              icon: 'nf nf-fa-search_minus',
              text: bbn._('Find previous') + ' <small>SHIFT+CTRL+G</small>',
              action: this.codeFindPrev
            }, {
              icon: 'nf nf-fa-exchange',
              text: bbn._('Replace') + ' <small>SHIFT+CTRL+F</small>',
              action: this.codeReplace
            }, {
              icon: 'nf nf-fa-retweet',
              text: bbn._('Replace All') + ' <small>SHIFT+CTRL+R</small>',
              action: this.codeReplaceAll
            },{
              icon: 'nf nf-fa-level_down',
              text: bbn._('Unfold all'),
              action: this.codeUnfoldAll
            },{
              icon: 'nf nf-fa-level_up',
              text: bbn._('Fold all'),
              action: this.codeFoldAll
            }]
          }, {
            text: bbn._('History'),
            items: [{
              icon: 'nf nf-fa-history',
              text: bbn._('Show'),
              action: this.history
            }, {
              icon: 'nf nf-fa-trash',
              text: bbn._('Clear'),
              action(){
                if ( bbn.ide ){
                  return bbn.ide.historyClear();
                }
              }
            }, {
              icon: 'nf nf-fa-trash',
              text: bbn._('Clear All'),
              action(){
                if ( bbn.ide ){
                  return bbn.ide.historyClearAll()
                }
              }
            }]
          }, {
            text: bbn._('Doc.'),
            items: [{
              icon: 'nf nf-fa-binoculars',
              text: bbn._('Find'),
            }, {
              icon: 'nf nf-fa-book',
              text: bbn._('Generate'),
            }]
          }, {
            text: bbn._('Pref.'),
            items: [{
              icon: 'nf nf-fa-cog',
              text: bbn._('Manage directories'),
              action: this.managerTypeDirectories
            }, {
              icon: 'nf nf-fa-language',
              text: bbn._('IDE style'),
              action: this.cfgStyle
            }]
          }
        ],
        type: false,
        nodeParent: false,
        urlTreeParser: false,
        sourceTreeParser:{
          error: false,
          treeData: false,
          class: false,
          idElement: false
        },
        errorTreeParser: false,
        treeParser: false,
        readyMenu: false,
        currentLine: 0,
        disabledLine: true,
        showGoTOLine: false,
        mountedTabnav: false
      }
    },
    computed: {
      listRootProject(){
        let roots = this.source.projects.roots.slice();
        if ( roots.length ) {
          return bbn.fn.map(roots, v => {
            switch (v.text) {
              case 'mvc':
                 v.text = '<i class="nf nf-fa-code"></i> '+ v.text;
                break;
              case 'components':
                v.text = '<i class="nf nf-mdi-vuejs"></i> '+ v.text;
                break;
              case 'lib':
                v.text = '<i class="nf nf-mdi-library"></i> '+ v.text;
                break;
              case 'cli':
                v.text = '<i class="nf nf-fa-cogs"></i> '+ v.text;
                break;
            }
            return v;
          })
        }
        return [];
      },
      typeSearch(){
        if( this.caseSensitiveSearch ){
          return bbn._('sensitive');
        }
        else{
          return bbn._('insensitive');
        }
      },
      tabSelected(){
        return this.getRef('tabstrip').selected;
      },
      runRepository(){
        return this.currentRep;
        let rep = this.getRef('tabstrip').views[this.getRef('tabstrip').selected].source.repository;
        this.currentRep = rep;
        return rep;
      },
      currentURL(){
        if ( this.mountedTabnav ){
          return this.getRef('tabstrip').currentURL;
        }
        return '';
      },
      isSettings(){
        return this.currentURL.indexOf("/_end_/settings") !== -1;
      },
      currentEditor(){
        if ( this.currentURL !== '' ){
          if ( this.getRef('tabstrip') ){
            let tabnav = this.getRef('tabstrip').getSubRouter();
            if ( tabnav ){
              let currentTab = tabnav.activeRealContainer;
              if ( currentTab ){
               let codeEditor = currentTab.find('appui-ide-code');
                if ( codeEditor ){
                  return codeEditor;
                }
              }
            }
          }
        }
        return false;
      },
      currentCode(){
        if ( this.currentEditor){
          let codeEditor = this.currentEditor.find('bbn-code');
          if ( codeEditor ){
            return codeEditor;
          }
        }
        return false;
      },
      disabledWork(){
        bbn.fn.log("ss", this.currentURL ,this.currentURL.indexOf('/__end__/'))
        return this.currentURL.indexOf('/_end_/') > -1 ? false : true;

        //return this.currentEditor || this.isSettings ? false : true;
      },
      currentId(){
        if ( this.currentCode ){
          return this.currentEditor.source.id;
        }
        return false;
      },
      stateCurrent(){
        if ( this.currentEditor &&
          this.currentCode &&
          this.currentId
        ){
          let obj = bbn.fn.extend({},this.currentEditor.$options.computed,  true);
          bbn.fn.each(obj, (v, i)=>{
            obj[i] = this.currentEditor[i];
          }),

          obj.tab = this.currentEditor.$data.tab;
          obj.value = this.currentEditor.$data.value;
          obj.ssctrl = this.currentEditor.$data.ssctrl;
          obj.currentTree = this.typeProject;
          obj.selectedRunReposiotry = this.runRepository;
          obj.cursorPosition = this.currentCode.getState();
          delete obj.currentPopup;
         // this.abilitationTest(obj.isMVC);
          return obj;
        }
        //this.abilitationTest(false);
        return false;
      },
      //temporanely name
      possibilityParser(){
        if ( this.currentEditor ){
          if ( this.currentEditor.isClass ){
            return 'class';
          }
          else if ( this.currentEditor.isComponent ){
            return 'component';
          }
        }
        return false;
      },
      /**
       * Check if the current repository is a MVC
       *
       * @returns {boolean}
       */
      isMVC(){
        if ( !this.type ){
          return !!(this.repositories[this.currentRep] &&
            this.repositories[this.currentRep].tabs &&
            (this.repositories[this.currentRep].alias_code === "mvc"));
        }
        else{
          return this.type === "mvc";
        }
      },
      isComponent(){
        if ( !this.type ){
          return !!(this.repositories[this.currentRep] && (this.repositories[this.currentRep].alias_code === "components"));
        }
        else{
          return this.type === "component";
        }
      },
      isProject(){
        return !!(this.repositories[this.currentRep] && this.repositories[this.currentRep].types && (this.repositories[this.currentRep].types.length > 0));
      },
      treeInitialData(){
        let obj = {
          repository: this.currentRep,
          repository_cfg: this.repositories[this.currentRep],
          is_mvc: this.isMVC,
          is_component: this.isComponent,
          filter: this.searchFile,
          uid: this.path,
          onlydirs: false,
          tab: false,
          is_project: this.isProject,
          project: this.project
        };

        if (this.typeProject !== false) {
          obj.type = this.typeProject;
        }
        else {
          obj.type = 'mvc';
        }
        if (this.isProject && (!this.path || !this.path.length)) {
          obj.uid = obj.type;
        }
        return obj;
      },
      ddRepData(){
        const r = [];
        bbn.fn.each(this.repositories, (a, i) => {
          r.push({
            value: i,
            text:  a.text !== 'main' ? a.text : "<label class='bbn-b'>"+a.text+"<label>"
          });
        });
        return bbn.fn.order(r, "text");
      },
      iconLegendParser(){
        if ( this.legendParser ){
          return "nf nf-fa-eye_slash";
        }
        return  "nf nf-fa-eye";
      }
    },
    methods: {
      createTabstrip(){
        this.mountedTabnav = !this.mountedTabnav;
      },
      goToLine(){
        let lastLine = this.currentCode.widget.lastLine(),
            line = this.currentLine;
        if ( line > lastLine ){
          line = lastLine;
        }
        this.currentEditor.goLine(line);
      },
      selectRecentFile(file, obj){
        this.getRef('tabstrip').load(obj.path);
      },
      setReadyMenu(){
        if ( !this.readyMenu ){
          this.readyMenu = true;
        }
      },
      getRecentFiles(){
        this.post(this.source.root + 'get_recent_files',{}, d=>{
          let menu = this.getRef('mainMenu').currentData[0]['data']['items'];
          if ( d.success ){
            let arr = [];
            bbn.fn.each(d.files, (v, i)=>{
              arr.push({
                icon: 'nf nf-fa-file_text',
                text: v.file,
                path: v.path,
                action: (v, i) =>{
                  this.selectRecentFile(v, i);
                }
              });
            });
            if ( menu !== undefined ){
              menu[menu.length-1]['items'] = arr;
            }
          }
          else{
            menu[menu.length-1]['items'] = [];
            this.recentFiles = false;
          }
        });
      },
      //for parser tree
      getTreeParser(){
        this.treeParser = false;
        if ( this.possibilityParser === 'class' ){
          this.post(this.source.root + 'parser',{
            cls: this.currentId,
            repository: this.currentEditor.source.repository,
            project: this.isProject
          }, d =>{
            let obj = {
              tree: false,
              class: false,
            };
            if ( d.data.success ){
              if ( this.possibilityParser === 'class' ){
                bbn.fn.each(d.data.tree, (val, idx) =>{
                  bbn.fn.each(val['items'], (ele,i)=>{
                     ele['items'] =  bbn.fn.order(ele['items'], 'name', 'ASC')
                  });
                })
              }
              this.sourceTreeParser.treeData = d.data.tree;
              this.sourceTreeParser.class = d.data.class;
              this.sourceTreeParser.error = false;
              this.sourceTreeParser.idElement = this.currentId;
              this.treeParser = true;
            }
            else{
              this.sourceTreeParser.treeData = false;
              this.sourceTreeParser.class = false;
              this.sourceTreeParser.error = true;
              this.treeParser = false;
            }
          });
        }
        else if ( this.possibilityParser === 'component' ){
          this.sourceTreeParser.treeData = this.parserComponent();
          if ( this.sourceTreeParser.treeData === false ){
            this.sourceTreeParser.error = true;
          }
          else {
            this.sourceTreeParser.idElement = this.currentId;
            this.treeParser = true;
          }
        }
      },
      parserComponent(){
        if ( this.currentEditor &&
          (this.possibilityParser === "component") &&
          ( this.currentCode.mode === "js")
        ){
          let obj = eval(this.currentEditor.value),
              src = [],
              ele = {},
              values = [];
          bbn.fn.each(obj, (content, prop) => {
            if ( (prop === 'methods') || (prop === 'computed') || (prop === 'watch') ){
              values = Object.keys(content);
            }
            else if ( prop === 'props' ){
              values = content
            }
            /*else if ( prop === 'data' ){
              values = Object.keys(obj.data());
            }*/
            else{
              values = false
            }
            ele = {
              text: prop,
              name: prop,
              num: !values ? 0 : values.length,
              numChildren: !values ? 0 : values.length,
              items: []
            };

            if( ele.num > 0 ){
              bbn.fn.each(values, (val, i)=>{
                ele.items.push({
                  text: val,
                  name: val,
                  num: 0,
                  numChildren: 0,
                  eleComponent: ele.name,
                  component: true,
                  item: []
                });
              });
            }
            src.push(ele);
          });
          return src;
        }
        return false;
      },
      //for parser class
      parserClass(){
        if ( this.possibilityParser === "class" ){
          this.post(this.source.root + 'parser',{
            cls: this.currentId,
          }, d =>{
            let obj = {
              tree: false,
              class: false
            };
            if ( d.data.success ){
              if ( this.possibilityParser === 'class' ){
                bbn.fn.each(d.data.tree, (val, idx) =>{
                  bbn.fn.each(val['items'], (ele,i)=>{
                    ele['items'] =  bbn.fn.order(ele['items'], 'name', 'ASC')
                  });
                })
              }
              obj.tree = d.data.tree;
              obj.class = d.data.class;
            }
          });
        }
        this.$nextTick(()=>{
          if ( obj !== undefined )
          return obj;
        });
      },
      managerTypeDirectories(){
        this.post(this.source.root + 'directories/data/types', d => {
          if ( d.data.success ){
            this.getPopup().open({
              width: 600,
              height: 800,
              title: bbn._('Manager type directories'),
              component: 'appui-ide-popup-directories-types',
              source:{
                types: d.data.types
              }
            });
          }
        });
      },
      cfgStyle(){
        if ( this.source.themes ){
          this.getPopup().open({
            width: 550,
            height: 450,
            title: bbn._('Select theme'),
            component: 'appui-ide-popup-style',
            source:{
              root: this.source.root,
              themeCode: this.themeCode,
              themes: this.source.themes
            }
          });
        }
      },
      searchOfContext(node, component = false, is_vue = false){
        let title = bbn._('Search in') + ' : ' + node.data.uid,
            path = node.data.uid;
        if ( component ){
          title = bbn._('Search in') + ' : ' + node.data.name + ` <i class='nf nf-fa-vuejs'></i>`;
          if ( is_vue ){
            path = node.data.uid.split('/');
            path.pop();
            path = path.join('/');
          }
        }
        this.getPopup().open({
          width: 500,
          height: 120,
          title: title,
          component: 'appui-ide-popup-search',
          scrollable: false,
          source: {
            url: this.url,
            is_vue: is_vue,
            is_project: this.isProject,
            type: node.data.type !== false || node.data.type !== undefined ? node.data.type : false,
            repository: node.data.repository,
            path: path
          }
        });

      },
      searchingContent(e){
        if ( this.search.searchElement.length > 0 ){
          let url = this.url+'/search/',
              //for encode string in base64
              search = btoa(this.search.searchElement);
          if ( this.search.all ){
            url += '_all_'+'/' + search;
          }
          else {
            url += this.currentRep +'/';
            //search in a project
            if ( this.isProject ){
              url += '_project_/' + this.typeProject + '/';
            }
            url += '_end_/' + this.typeSearch +'/'+ search;
          }
          this.$nextTick(()=>{
            this.search.all = false;
            bbn.fn.link(url, true);
          });
        }
      },

      /** ###### REPOSITORY ###### */
      /**
       * Returns the items' template for the repositories dropdownlist
       *
       * @param e
       * @returns {string}
       */
      tplRep(e){
        if ( e.value && this.repositories[e.value] ){
          const cfg = this.repositories[e.value];
          return '<div style="clear: none; background-color: ' + cfg.bcolor +'; color: ' + cfg.fcolor + '" class="bbn-100">' + e.text + '</div>';
        }
      },

      /**
       * Gets the path property from the current repository
       *
       * @returns string|boolean
       */
      getRepPath(){
        if ( this.repositories[this.currentRep] &&
          this.repositories[this.currentRep].path
        ){
          return this.repositories[this.currentRep].path;
        }
        return false;
      },

      /**
       * Gets the path property from the current repository's tab
       *
       * @param tab The tab's url
       * @param rep The repository's name
       * @returns string|boolean
       */
      getTabPath(tab, rep){
        rep = rep || this.currentRep;
        if ( tab && this.repositories[rep] && this.repositories[rep].tabs ){
          // Super controller
          if ( tab.indexOf('_ctrl') > -1 ){
            tab = '_ctrl';
          }
          if ( this.repositories[rep].tabs[tab] && this.repositories[rep].tabs[tab].path ){
            return this.repositories[rep].tabs[tab].path;
          }
        }
        return false;
      },

      /**
       * Gets the tab's extensions
       *
       * @param rep The repository's name
       * @param tab The tab's url
       * @returns array|boolean
       */
      getExt(rep, tab){
        if ( this.repositories[rep] ){
          // MVC
          if ( tab && this.repositories[rep].tabs ){
            // Super controller
            if ( tab.indexOf('_ctrl') > -1 ){
              tab = '_ctrl';
            }
            if ( this.repositories[rep].tabs[tab] && this.repositories[rep].tabs[tab].extensions ){
              return this.repositories[rep].tabs[tab].extensions;
            }
          }
          else if ( this.repositories[rep].extensions ){
            return this.repositories[rep].extensions;
          }
        }
        return false;
      },

      /**
       * Gets the default text of a file by the extension
       *
       * @param ext The extension
       * @param tab The MVC tab's name (if the file's a MVC)
       * @returns {*}
       */
      getDefaultText(ext, tab){
        if ( this.repositories[this.currentRep] ){
          // MVC
          if ( tab && this.repositories[this.currentRep].tabs ){
            // Super controller
            if ( tab.indexOf('_ctrl') > -1 ){
              tab = '_ctrl';
            }
            if ( this.repositories[this.currentRep].tabs[tab] && this.repositories[this.currentRep].tabs[tab].extensions ){
              return bbn.fn.getField(this.repositories[this.currentRep].tabs[tab].extensions, 'default', 'ext', ext);
            }
          }
          else if ( this.repositories[this.currentRep].extensions ){
            return bbn.fn.getField(this.repositories[this.currentRep].extensions, 'default', 'ext', ext);
          }
        }
        return false;
      },

      /**
       * check the tab before closing if there are any code changes in case it saves them
       * the difference with the method and block the close event of the tab and then resume it
       *
       */
      ctrlCloseTab(idx, ev){
        let tabstrip = this.getRef('tabstrip');
        ev.preventDefault();
        if ( tabstrip ){
          let view = bbn.fn.getRow(tabstrip.views, {idx: idx}),
              cont = view && view.url ? tabstrip.urls[view.url] : false,
              router = cont ? cont.find('bbn-router') : false,
              numDirty = router ? router.dirtyContainers.length : false;
          if ( numDirty ){
            appui.confirm(bbn._('Do you want to save the changes before closing the tab?'), () => {
              bbn.fn.each(router.dirtyContainers, c => {
                let code = router.urls[c.url].find('appui-ide-code');
                if ( bbn.fn.isVue(code) ){
                  code.$once('saved', () => {
                    numDirty--;
                    if ( !numDirty ){
                      this.$nextTick(() => {
                        tabstrip.close(idx, true);
                      })
                    }
                  });
                  code.save();
                }
              })
            });
          }
          else {
            tabstrip.close(idx, true);
          }
        }
      },
      /**
       * function to close the tab from the dropdown menu file
       *
       *
       */
      closeTab(){
        let ctrlChangeCode = this.getRef('tabstrip').getVue(this.$refs.tabstrip.selected).find('appui-ide-code').isChanged
        if ( ctrlChangeCode ){
          appui.confirm(
            bbn._('Do you want to save the changes before closing the tab?'),
            () => {
              this.save( true );
              this.getRef('tabstrip').close(this.getRef('tabstrip').selected, true);
            },
            () => {
              this.getRef('tabstrip').close(this.getRef('tabstrip').selected, true);
            }
          );
        }
        else {
          this.getRef('tabstrip').close(this.getRef('tabstrip').selected, true);
        }
      },
      /**
       * Check and close all tabs callback the function closeTab
       *
       */
      closeTabs(){
        this.$refs.tabstrip.closeAll();
      },
      /**
       * Makes a data object necessary on file actions
       *
       * @param rep The repository's name
       * @param tab The tab's name (MVC)
       * @returns {*}
       */
      makeActionData(rep, tab){
        if ( rep &&
          this.repositories &&
          this.repositories[rep] &&
          this.repositories[rep].path
        ){
          return {
            repository: rep,
            rep_path: this.repositories[rep].path,
            tab_path: tab ? this.getTabPath(tab, rep) : false,
            tab: tab || false,
            extensions: this.getExt(rep, tab)
          }
        }
        return false;
      },

      /** ###### TREE ###### */

      /**
       * function performed by the map to adapt the date to the tree
       *
       */
      treeMapper(a){
        a.text += a.git === true ?  "  <i class='nf  nf-fa-github'></i>" : ""
        if ( a.folder ){
          bbn.fn.extend(a, {
            repository: this.currentRep,
            repository_cfg: this.repositories[this.currentRep],
            onlydirs: false,
            tab: a.is_vue ? a.tab : false,
            tab_mvc: a.tab,
            root_project: a.root_project,
            is_mvc: this.isMVC,
            is_vue: a.is_vue,
            is_component: this.isComponent,
            is_project: this.isProject,
            project: this.project,
            filter: this.searchFile,
          }, true);
        }
        return a;
      },
      /**
       * function to define the context menu of each node of the tree
       *
       */
      treeContextMenu(n , i){
        let objContext = [{
            icon: 'nf nf-fa-edit',
            text: bbn._('Rename'),
            action: (node) => {
              this.rename(node)
            }
          }, {
            icon: 'nf nf-fa-copy',
            text: bbn._('Copy'),
            action: (node) => {
              this.copy(node)
            }
          }, {
            icon: 'nf nf-fa-trash',
            text: bbn._('Delete'),
            action: (node) => {
              this.deleteElement(node)
            }
          }
        ];
        //case components vue
        if ( (n.data.type === 'components') &&
          (n.data.folder === true) &&
          (n.data.is_vue === true) &&
          (n.num > 0)
        ){
          objContext.push({
            icon: 'nf nf-fa-search',
            text: bbn._('Find in Component vue'),
            action: node => {
              this.searchOfContext(node, true, true);
            }
          });
          objContext.push({
            icon: 'nf nf-fa-edit',
            text:  bbn._('Rename component vue'),
            action: node => {
              this.rename(node, false, true);
            }
          });
          objContext.push({
            icon: 'nf nf-fa-copy',
            text:  bbn._('Copy component vue'),
            action: node => {
              this.copy(node, true);
            }
          });
          objContext.push({
            icon: 'nf nf-fa-trash_alt',
            text:  bbn._('Delete component vue'),
            action: node => {
             this.deleteElement(node, true);
            }
          });
        }
        if ( n.data.folder ){
          let obj = objContext.slice(),
              arr = [{
                icon: 'nf nf-fa-folder',
                text: n.data.type === 'components' ? bbn._('New directory component') : bbn._('New directory'),
                action: (node) => {
                  this.newDir(node)
                }
              }, {
                icon: n.data.type && n.data.type === 'components' ? 'nf nf-fa-vuejs' : 'nf nf-fa-file',
                text: n.data.type && n.data.type === 'components' ? bbn._('New component') : bbn._('New file'),
                action: (node) => {
                  this.newElement(node)
                }
              }, {
                icon: 'nf nf-fa-search',
                text: n.data.type && n.data.type === 'components' ? bbn._('Find in folder Component vue') : bbn._('Find in Path'),
                action: node => {
                  let comp = n.data.type && n.data.type === 'components'  ? true : false;
                  this.searchOfContext(node, comp, n.data.is_vue);
                }
              }];

          bbn.fn.each(arr , (item ,id)=>{
            obj.unshift(item);
          });

          return obj;
        }
        else{
          let obj = objContext.slice();
          if ( this.isMVC ){
            let arr = [
              {
                icon: 'nf nf-fa-external_link',
                text: bbn._('Go to') + " CSS",
                color: "red",
                action: (node) => {
                  this.goToTab(node, "css")
                }
              },{
                icon: 'nf nf-fa-external_link',
                text: bbn._('Go to') + " Javascript",
                action: (node) => {
                  this.goToTab(node, "js")
                }
              },{
                icon: 'nf nf-fa-external_link',
                text: bbn._('Go to') + " View",
                action: (node) => {
                  this.goToTab(node, "html")
                }
              },{
                icon: 'nf nf-fa-external_link',
                text: bbn._('Go to') + " Model",
                action: (node) => {
                  this.goToTab(node, "model")
                }
              },{
                icon: 'nf nf-fa-external_link',
                text: bbn._('Go to') + " Controller",
                action: (node) => {
                  this.goToTab(node, "php")
                }
              }
            ];
            arr.forEach((item ,id)=>{
              obj.unshift(item);
            })
          }
          obj.unshift({
            icon: 'nf nf-fa-magic',
            text: bbn._('Test code!'),
            action: ( node )=>{
              this.testNodeOfTree(node)
            }
          });
          // profiling
          if ( (n.data.type === 'mvc') &&
            !n.data.folder &&
            ((n.data.tab === 'php') || (n.data.tab === 'private'))
          ){
            obj.push({
              icon: 'nf nf-fa-cogs',
              text: bbn._('Profiling'),
              action:  node =>{
                let root = appui.plugins[bbn.fn.getField(this.ddRepData, 'text', 'value', this.currentRep)];
                root = root !== undefined ? root+'/' : '';
                //bbn.fn.link('ide/profiler/url/'+ root + node.data.path);
                bbn.fn.link(appui.plugins['appui-ide'] + '/profiler/url/'+ root + node.data.uid);
              }
            });
          }
          return obj;
        }
      },
      goToTab(ele, tab){
        this.getRef('tabstrip').load(
          'file/' +
          this.currentRep +
          (ele.data.dir || '') +
          ele.data.name +
          '/_end_/' + tab
        );
      },
      /**
       * function for reloading the entire tree fileList
       *
       */
      treeReload(n, i){
        if ( this.getRef('filesList') ){
          this.getRef('filesList').reload();
        }
      },
      /**
       * Callback function triggered when you click on an item on the files|folders tree
       *
       * @param id
       * @param d The node data
       * @param n The node
       */
      treeNodeActivate(d, e){
        e.preventDefault();
        if ( !d.data.folder || (d.data.folder && d.data.is_vue) ){
          if( !this.isProject && !this.isMVC && this.existingTab(d) ){
            //change d.data.path for d.data.uid
            bbn.fn.link(
              this.source.root + 'editor/file/' +
              this.currentRep +
               (d.data.uid || '') +
              '/_end_/code',
              true
            );
          }
          else{
            this.openFile(d);
          }
        }
      },

      /** ###### TAB ###### */
      /*
       * check if what we are looking for is in the open tabs
       */
      existingTab(ele){
        let exist = false;
        for(let tab of this.getRef('tabstrip').views){
          if ( tab.title === ele.data.path ){
            exist = true;
            break;
          }
        }
        return exist;
      },

      /**
       * Adds a file (tab) to the tabNav
       *
       * @param tabnav
       * @param file
       */
      openFile(file){
        let tab = '',
            link = false;
        if ( (file.data.type === 'mvc') ){
          tab = ((file.data.tab === "php") && (this.project === 'apst-app')) ? '/settings' :  '/' + file.data.tab
          link = 'file/' +
            this.currentRep + '/mvc/' +
            (file.data.dir || '') +
            file.data.name +
            '/_end_' + (tab.indexOf('_') === 0 ? '/' + tab : tab);
        }
        else{
         link =  'file/' +  this.currentRep +'/'+ file.data.uid + '/_end_/' + (file.data.tab !== false ? file.data.tab : 'code');
        }
        if ( link ){
          this.getRef('tabstrip').route(link);
        }
      },

      /**
       * Function who return container of the code active or component code active
       *
        * @param getCode
       */
      getActive(getCode = false){
        let tn = this.getRef('tabstrip');
        if ( tn && tn.views[tn.selected] ){
          if ( !getCode ){
            return tn.getSubRouter(tn.selected);
          }
          return tn.getRealVue().find('appui-ide-code');
        }
        return false;
      },

      /**
       * Adds menu to a tab and submenus to sub
       *
       * @param o
       * @returns {string}
       */
      mkMenu(o){
        let st = '';
        if (o.text) {
          if (o.text) {
            st += '<li>';
            if (o.link || o.function) {
              st += '<a href="' +
                ( o.link ? o.link : 'javascript:;' ) +
                '"' + ( o.function ? ' onclick="' + o.function + '"' : '' ) +
                '>';
            }
            st += o.text;
            if (o.link || o.function) {
              st += '</a>';
            }
            if (o.items && o.items.length) {
              st += '<ul>';
              bbn.fn.each(o.items, (v, i) => {
                st += this.mkMenu(v);
              });
              st += '</ul>';
            }
            st += '</li>';
          }
        }
        return st;
      },


      /** ###### EDITOR ###### */

      color(node){
        return node.data.bcolor
      },

      /**
       * Sets the font to editors
       * @param font
       * @param font_size

      setFont(font, font_size){
        //$("div.CodeMirror", this.$el).css("font-family", font ? font : this.font);
        this.$el.querySelector("div.CodeMirror").style.font_family =  font ? font : this.font;
        //$("div.CodeMirror", this.$el).css("font-size", font_size ? font_size : this.font_size);
        this.$el.querySelector("div.CodeMirror").style.font_size =  font ? font : this.font; 
      },
       */
      /**
       * Evaluates a code, in different ways depending on its nature
       *
       *
       */
      test() {
        let cp =  this.getActive(true);
        let component = cp.closest('appui-ide-component');
        if (component) {
          let url = component.closest('bbn-container').url;
          let root = '';
          let cp = '';
          let foundComponents = false;
          // Removing file/ and /_end_
          let bits = url.split('/');
          bits.splice(0, 1);
          bits.splice(bits.length - 2, 2);

          bbn.fn.each(bits, (a) => {
            if ( a === 'components' ){
              foundComponents = true;
            }
            else if ( !foundComponents ){
              root += a + '/';
            }
            else {
              cp += a + '-';
            }
          });
          if (cp) {
            let found = false;
            root = root.substr(0, root.length-1);
            cp = cp.substr(0, cp.length-1);
            bbn.fn.log("ROOT", root, "CP", cp, "PREFIX", bbn.env.appPrefix);
            if ( root === 'app/main' ){
              found = bbn.env.appPrefix + '-' + cp;
            }
            else if ( root === 'BBN_CDN_PATH/lib/bbn-vue' ){
              found = 'bbn-' + cp;
            }
            else{
              bbn.fn.iterate(appui.plugins, (a, n) => {
                if (root.indexOf('lib/' + n) === 0) {
                  found = n + '-' + cp;
                  return false;
                }
              })
            }
            if ( found ){
              bbn.version++;
              bbn.vue.unloadComponent(found);
              appui.info(bbn._("The component has been deleted") + '<br>' + bbn._("Loading a page with this component will redefine it."));
            }
            else{
              appui.error(bbn._("Impossible to retrieve the name of the component"));
            }
          }
        }
        else {
          if ( this.isSettings ){
            let key = this.currentURL.substring(0, this.currentURL.indexOf('_end_/')+5),
                mvc = this.findByKey(key).find('appui-ide-mvc').$data,
                pathMVC = mvc.path;
            if ( pathMVC.indexOf('mvc/') === 0 ){
              pathMVC = pathMVC.replace("mvc/","");
            }
            let link = (mvc.route ? mvc.route + '/' : '') +
            (pathMVC === 'mvc' ? '' : pathMVC + '/') +  mvc.filename;

            appui.find('bbn-router').load(link, true);
          }
          else{
            let code = this.getActive(true);
            code.test();
          }
        }
      },

      testNodeOfTree(node){
        if ( this.isProject && (this.typeProject === 'mvc') ){
          let route = this.repositories[this.currentRep].route ? this.repositories[this.currentRep].route + '/' :'' ;
          //bbn.fn.link( route + node.data.path, true );
          bbn.fn.link( route + node.data.uid, true );
        }
        else{
          this.treeNodeActivate(node);
          setTimeout(()=>{
            this.test();
          }, 1000);
        }
      },

      /**
       * Saves the currently visible codemirror instance
       *
       * @returns {number}
       */
      save(ctrl = false){
        let active = this.getActive(true);
        if ( active && (typeof(active.save) === "function") ){
          return active.save();
        }
      },

      repositoryProject( type = false, repository = false ){
        let rep = bbn.fn.extend({}, ( repository === false ?  this.repositories[this.currentRep] : repository));
        if ( !type ){
          type = this.typeProject
        }
        //case mvc and component
        if ( this.source.projects.tabs_type[type] !== undefined && ((type !== 'lib') && (type !== 'cli')) ){
          return bbn.fn.extend(rep, {tabs: this.source.projects.tabs_type[type][0]});
        }
        else if ( this.source.projects.tabs_type[type] !== undefined && ((type === 'lib') || (type === 'cli')) ){
          return bbn.fn.extend(rep, {extensions: this.source.projects.tabs_type[type]['extensions']});
        }
        else{
          return false
        }
      },


      /**
       * New file|directory dialog
       *
       * @param string title The dialog's title
       * @param bool isFile A boolean value to identify if you want create a file or a folder
       * @param string path The current path
       */
      new(title, isFile, node = false){
        let src = {
          allData: false,
          isFile: isFile,
          path: './',
          node: false,
          template: null,
          repositoryProject: false,
          currentRep: this.currentRep,
          repositories: this.repositories,
          root: this.source.root,
          //parent: false,
          type: false,
          isProject: this.isProject
        };
        //case top menu

        if ( !bbn.fn.isObject(node) ){
          src.path = './'
          //case project
          if ( this.typeProject !== false ){
            src.type =  this.typeProject;
            if ( this.source.projects.tabs_type[this.typeProject] !== undefined ){
              src.repositoryProject = !this.repositoryProject(this.typeProject) ? this.repositories[this.currentRep] : this.repositoryProject(this.typeProject);
            }
            src.path = this.typeProject;
          }
        }
        //of context
        else {
          src.tab_mvc = node.data.tab_mvc;
          if ( node.num > 0 ){
            if( !node.isExpanded ){
              node.isExpanded = true;
            }
            //src.parent = bbn.vue.find(node, 'bbn-tree');
            this.nodeParent = bbn.vue.find(node, 'bbn-tree');
          }
          else{
            //src.parent= node.parent;
            this.nodeParent = node.parent;
          }
          //caseproject
          if ( node.data.type !== false ){
            src.type =  node.data.type;
            src.repositoryProject = !this.repositoryProject(node.data.type) ? this.repositories[this.currentRep] : this.repositoryProject(node.data.type);
            //case component
            if ( node.data.type === 'components' ){
              //if (  node.data.path.indexOf(node.data.dir + node.data.name + '/' + node.data.name) > -1 ){
              //src.path = node.data.path.replace( node.data.dir + node.data.name + '/' + node.data.name,  node.data.dir + node.data.name);
              if (  node.data.uid.indexOf(node.data.dir + node.data.name + '/' + node.data.name) > -1 ){
                src.path = node.data.uid.replace( node.data.dir + node.data.name + '/' + node.data.name,  node.data.dir + node.data.name);
              }
              else{
                //src.path = node.data.path;
                src.path = node.data.uid;
              }
            }//other types
            else{
              //src.path = node.data.path;
              src.path = node.data.uid;
            }
          }
          else{
            if ( node.data.folder ){
              //src.path = node.data.path;
              src.path = node.data.uid;
            }
          }
          src.allData = node.data;
        }
        //for root
        //src.prefix = this.prefix;
        if ( !bbn.fn.isObject(node) || node.data.folder ){
          //check path
          src.path = src.path.replace( '//',  '/');
          this.closest("bbn-container").getRef('popup').open({
            title: title,
            maximizable: true,
            component: 'appui-ide-popup-new',
            source: src,
          });
        }
      },

      /**
       * Opens a dialog for create a new file
       *
       * @param node  set at false if click of the context node is data of the node tree
       */
      newElement(node = false){
        let title = bbn._('New File');
        if ( this.isProject && bbn.fn.isObject(node) &&
          ((node.data.type !== false) || (this.typeProject !== false))
        ){
          if ( ((node !== false) && (node.data.type === 'components')) || (this.typeProject === 'components') ){
            title = bbn._('New Component') +  ` <i class='nf nf-fa-vuejs'></i>`;
          }
          else if ( ((node !== false) && (node.data.type === 'lib')) || (this.typeProject === 'lib') ){
            title = bbn._('New Class');
          }
        }
        this.new(title, true, node);
      },

      /**
       * Opens a dialog for create a new directory
       *
       * @param node  set at false if click of the context node is data of the node tree
       */
      newDir(node){
        this.new(bbn._('New Directory'), false, node != undefined && node ? node : false);
      },

      /**
       * Renames a file or a folder selected from the files list
       *
       * @param node  set at false if click of the context node is data of the node tree
       * @param menuFile for click in menu
       * @param onlyComponent true in case rename component
       */
      rename(node, menuFile= false, onlyComponent= false) {
        //case of click rename in contextmenu of the tree
        let tab = this.getRef('tabstrip').views[this.tabSelected].source,
            title = '';
        //of context menu
        if ( !menuFile ){
          var src = {
            nodeData: {
              folder: node.data.folder,
              ext: node.data.ext,
              path: node.data.uid,
              name: node.data.name,
              tab: node.data.tab,
              dir: node.data.dir,
              type: node.data.type
            },
            //parent: node.parent,
            isMVC: this.isProject && node.data.type === 'mvc' ? true : this.isMVC,
            isComponent: this.isProject && node.data.type === 'components' ? true : this.isComponent,
            root: this.source.root,
            currentRep: this.currentRep,
            repositories: this.repositories,
            repository: this.repositories[this.currentRep],
            is_project: this.isProject
          };
          this.nodeParent = node.parent;
          if ( node.data.type === 'lib' ){
             let temp = node.data.dir.split('/');
             temp.shift();
             src.nodeData.type = temp.join('/');
          }
        }
        else{
          //let tab = this.getRef('tabstrip').views[this.tabSelected].source,
          let path = tab.source.path.split('/');
          path.shift();
          let filename = path.pop();
          path = path.join('/');
          let tabInfo = {
              mvc: tab.source.isMVC,
              isComponent: tab.source.isComponent,
              path: tab.source.isMVC ? path : '',
              name: !tab.source.isMVC ? tab.source.filename : filename,
              repository: tab.source.repository
            },
            tabFile = tabInfo.name;
          var src = {
            nodeData:{
              folder: false,
              ext: !tabInfo.mvc ? tab.ext : "",
              path: tabInfo.path,
              name: tabInfo.name,
              tab: tabFile,
            },
            isMVC: tabInfo.mvc ,
            isComponent: tabInfo.isComponent,
            currentRep: tabInfo.repository,
            repositories: this.repositories,
            root: this.source.root,
            parent: false,
            repository: this.repositories[this.currentRep],
            is_project: this.isProject,
          };
        }

        // add informations for case project
        if ( this.isProject &&
          (( node.data !== undefined && node.data.type !== undefined && menuFile === false) ||
          (menuFile === true))
        ){
          if ( (tab !== false) && menuFile ){
            if ( tab.source.isMVC ){
              src.nodeData.type = "mvc";
            }
            else if ( tab.source.isComponent ){
              src.nodeData.type = 'components';
            }
            else if ( tab.source.isLib ){
              src.nodeData.type = 'lib';
            }
            else {
              src.nodeData.type = 'cli';
            }
          }

          src.only_component = onlyComponent;
          if  ( !menuFile ){
            src.repository = this.repositoryProject(node.data.type);
          }//menu
          else{
            if ( this.getActive(true).isMVC ){
              src.repository = this.repositoryProject('mvc');
            }
            else if ( this.getActive(true).isComponent ){
              onlyComponent = true;
              src.only_component = onlyComponent;
              src.nodeData.folder = true;
              let path = tab.title.split('/');
              if ( path[0] === "" ){
                path.shifth();
              }
              let component = path.pop();
              src.nodeData.path = path.join('/')+'/'+ component;
              src.repository = this.repositoryProject('components');
            }
          }
          // case component or rename of the menu or context of the tree
          if ( (node.data !== undefined  && node.data.is_vue === true) ||
            (menuFile && (this.getActive(true).isComponent))
          ){
            src.component_vue =  true;

            if ( onlyComponent ){
              title = title = bbn._('Rename only component vue');
            }
            else{
              title = title = bbn._('Rename component vue and your content');
            }
          }
        }
        else{
          title =  node.data.folder ? bbn._('Rename folder') : bbn._('Rename');
        }
        this.tempNodeofTree= node;
        this.getPopup().open({
          width: 370,
          height: 150,
          title: src.isComponent ? bbn._('Rename component') : bbn._('Rename'),
          component: 'appui-ide-popup-rename',
          source: src
        });
      },

      /**
       * Copies a file or a folder selected from the files list
       *
       * @param data The node data
       */
      copy(node, onlyComponent= false){
        this.nodeParent = node.parent;
        let src = {
          data: node.data,
          currentRep: this.currentRep,
          repositories: this.repositories,
          repository: this.repositories[this.currentRep],
          root: this.source.root,
          isMVC: this.isMVC || node.data.type === 'mvc',
          isComponent: this.isComponent || node.data.type === 'components',
          config: this.source.config,
          isProject: this.isProject,
          type: this.typeProject
        //  parent: node.parent
        },
        title = '';
        if ( (node.data.dir !== undefined) &&
          (node.data.dir === '') &&
          node.data.type.length
        ){
          src.data.dir = node.data.type+'/';
        }
        if ( node.data.type === 'components' ){
          title = bbn._('Copy component');
        }
        else{
          title =  node.data.folder ? bbn._('Copy folder') : bbn._('Copy');
        }
        if ( (node.data.type !== undefined) && this.isProject ){
          src.only_component = onlyComponent;
          src.repository = this.repositoryProject(node.data.type)

          if ( node.data.is_vue === true ){
            src.component_vue = true;
          }

        }
        else{
          title = node.data.folder ? bbn._('Copy folder') : bbn._('Copy');
        }
        this.getPopup().open({
          width: 470,
          height: 250,
          title: title,
          component: 'appui-ide-popup-copy',
          source: src
        });

      },
      /**
       * Function that is activated to the operation done at the node to make it be carried out again.
       *
       * @param data The node
       */
      reloadAfterTree(node, action){
        let treeOfNode = bbn.vue.closest(node, 'bbn-tree'),
          treeParent = treeOfNode.$parent;
        switch( action ){
          case 'delete':{
            let numChildren = treeOfNode.items.length;
            treeOfNode.reload();
            if ( numChildren === 1 ){
              treeParent.numChildren = 0;
            }
          }break;
          case 'create':{
            //In the creation phase if it is a folder that already has children then opens its content (tree) and makes the reload.
            if ( node.data.folder ){
              //If you add a file or folder to an existing folder that has no child, then we reload it to the parent tree.

              if ( node.numChildren === 0 ){
                node.isExpanded = true;

                this.$nextTick(() => {
                  node.numChildren = node.numChildren + 1;
                });

                setTimeout(()=>{
                  this.$nextTick(() => {
                    bbn.vue.find(node, 'bbn-tree').reload();
                  });
                }, 800);

              }
              else if ( node.numChildren > 0 ){
                node.isExpanded = true;
                bbn.vue.find(node, 'bbn-tree').reload();
              }
              else{
                bbn.vue.closest(node, 'bbn-tree').reload();
              }
            }
            //if we click on a new in a node that is not a folder in an open tree
            else{
              node.parent.reload();
            }

          }break;
          case 'rename':{

            //node.$parent.reload();
          }break;
        }
      },
      /**
       * Deletes a file or a folder selected from the files list
       *
       * @param data The node data
       */
     deleteElement(node, onlyComponent= false){
        if (
          node &&
          node.data.name &&
          (node.data.dir !== undefined) &&
          (node.data.folder || (!node.data.folder && node.data.ext) )
        ){
          this.tempNodeofTree= node;
          let src = {
            repository: this.repositories[this.currentRep],
            path: node.data.dir,
            name: node.data.name,
            ext: node.data.ext,
            num: node.num,
            is_file: !node.data.folder,
            is_mvc: this.isMVC || node.data.type === 'mvc',
            is_component: this.isComponent || node.data.type === 'components',
            data: node.data,
            root: this.source.root,
            type: false,
            is_project: this.isProject,
          },
          text = "";
          if ( (node.data.type !== undefined) && this.isProject ){
            src.only_component = onlyComponent;
            src.repository = !this.repositoryProject(node.data.type) ? this.repositories[this.currentRep] : this.repositoryProject(node.data.type);
            src.type = node.data.type;
            if( node.data.type === 'components' && this.isComponent ){
              src.only_component = onlyComponent;
              if (  node.data.is_vue !== undefined ){

                src.only_component = onlyComponent;

                if ( node.data.is_vue === true ){
                  src.component_vue = true;
                }
                if ( onlyComponent || (node.num === 0 && node.data.is_vue === true) ){
                  text = bbn._('Are you sure you want to delete the component') + ' ' +
                    '<strong>' + node.data.name +  ' </strong>' + ' ?';
                }
                else{
                  text = text = bbn._('Are you sure you want to delete the folder') + ' ' +
                    '<strong>' + node.data.name +  ' </strong>' + ' ?';
                }
              }
            }
          }
          else if ( (node.data.type === undefined) ||
            (!node.data.type) ||
            (node.data.type !== 'components')
          ){
            text = bbn._('Are you sure you want to delete') +
              ( node.data.folder === true ? ' ' + bbn._('the folder') + ' ': ' ' ) +
              '<strong>' + node.data.name +  ' </strong>' + ' ?' ;
          }

          let title = src.is_file ? bbn._('Remove File') : bbn._('Remove Folder');
            this.tempNodeofTree = node;
            this.getPopup().open({
              width: 450,
              title: node.data.type === 'components' && node.data.is_vue ? bbn._('Remove Component') : title,
              height: 200,
              component: 'appui-ide-popup-remove',
              source: src
            });

        }
        else{
          appui.error(bbn._("Error!"));
        }
      },

      /**
       * Function for move node in tree
       */
      moveNode(select, dest, a){
        if ( dest.data.folder ){
          //let path = select.data.path.split('/'),
          let path = select.data.uid.split('/'),
              //new_path = dest.data.path,
              new_path = dest.data.uid,
              repositoryProject = false,
              isMVC = this.isMVC;

          path.pop();

          if ( this.isProject === true ){
            repositoryProject = !this.repositoryProject(this.typeProject) ? this.repositories[this.currentRep] : this.repositoryProject(this.typeProject);
            if ( (this.typeProject === 'components') &&
             ((select.data.type === 'components') && (dest.data.type === 'components'))
            ){
              path.pop();
              if ( dest.data.is_vue ){
                new_path = new_path.split('/');
                new_path.pop();
                new_path = new_path.join('/');
              }
            }
            else if( this.typeProject === 'mvc' ){
              isMVC = true;
            }
          }

          path = path.join('/');

          let obj = {
            new_name: select.data.name,
            is_file: !select.data.folder,
            is_project: this.isProject,
            type: this.isProject ? this.typeProject : false,
            is_component: this.typeProject === 'components' ? true : false,
            ext: select.data.ext,
            path: path + '/',
            new_path: new_path,
            name: select.data.name,
            tab: select.data.tab,
            dir: select.data.dir,
            is_mvc: isMVC,
            isComponent: this.isComponent,
            root: this.source.root,
            repository: !repositoryProject ? this.repositories[this.currentRep] : repositoryProject
          };


          this.post(this.source.root + 'actions/move', obj, (d) =>{
            if ( d.success ){
              let tabTitle = obj.path + obj.name,
                tabs = this.findAll('bbn-container');

              if ( this.isProject ){
                tabTitle = obj.type + '/' + tabTitle;
              }
              //if a node is moved from a tree and that it is open
              this.$nextTick(()=>{
                let idTab = bbn.fn.search(tabs, 'title', tabTitle);

                if( idTab > -1 ){
                  this.find('bbn-router').close(idTab);
                }
              });
              this.$nextTick(()=>{
                bbn.vue.closest(dest, 'bbn-tree').reload();
                appui.success(bbn._('Successfully moved'));
              });
            }
            else{
              if ( d.exist ){
                alert(bbn._('Impossible to have two items with the same name'));
              }
              appui.error(bbn._('Error move'));
            }
          });
        }
        else{
          alert(bbn._('The recipient node is not a folder'));
          this.treeReload();
        }
      },
      /**
       * Deletes the current opened file
       */
      deleteActive(){
        appui.confirm(bbn._('Are you sure you want to delete it?'), () => {
          let code = this.getActive(true),
              obj = {
                repository: code.rep, 
                path: code.path,
                name: code.filename,
                ext: code.extension || false,
                is_file: true,
                is_mvc: code.isMVC,
                is_component: code.isComponent
              };

          if ( (code !== undefined) &&
            (code.source.id !== undefined) &&
            (obj.name !== undefined) &&
            (obj.path !== undefined ) &&
            (obj.is_mvc !== undefined) &&
            (obj.is_component !== undefined) &&
            (obj.repository !== undefined)
          ){
            if ( code.isComponent && this.isProject){
              obj.repository = this.repositoryProject('components');
            }
            else if ( code.isMVC && this.isProject){
              obj.repository = this.repositoryProject('mvc');
              obj.active_file = true;
            }
            this.post(this.source.root + 'actions/delete', obj, (d) => {
              if ( d.success ){
                this.getRef('tabstrip').close(this.tabSelected);
                appui.success(bbn._("Deleted!"));
                this.treeReload();
              }
              else {
                appui.error(bbn._("Error!"));
              }
            });

          }
          else{
            alert("error")
          }
        });
      },
      /** ###### HISTORY ###### */
      history(){
        const tabNav = this.getActive();
        if ( tabNav ){
          tabNav.add({
            title: bbn._('History'),
            load: false,
            url: 'history',
            selected: true,
            component: 'appui-ide-history',
            source: tabNav.$parent.$data
          });
        }
        tabNav.selected = tabNav.getIndex('history');
        this.$nextTick(()=>{
          tabNav.activateIndex(tabNav.selected);
        });
      },
      /** ###### I18N ###### */
      i18n(){
        let tabnav = this.getRef('tabstrip'),
            tabnavActive = tabnav.activeRouter,
            currentIde = tabnavActive.$parent,
            table_data  = [];

        this.post( this.source.root + 'i18n/data/table', {
          table_path: currentIde.path ? currentIde.path : '',
          /** path of current repository */
          currentRep: this.currentRep,
          /** cfg of current repository */
          repository: this.repositories[currentIde.repository],
          ext: bbn.fn.search(this.repositories[currentIde.repository].extensions, 'ext', currentIde.ext) > -1 ? currentIde.ext : '',
          file_name: currentIde.filename,
        }, ( d ) => {
          if ( tabnavActive && d.success ){
            tabnavActive.add({
              title: bbn._('i18n'),
              load: false,
              url: 'i18n',
              selected: true,
              component: 'appui-ide-i18n',
              source: d
            });
            tabnavActive.selected = tabnavActive.getIndex('i18n');
          }
        });
      },
      codeSearch(){
        if ( this.currentCode ){
          this.currentCode.widget.focus();
          this.currentCode.widget.execCommand('find');
        }
      },
      codeFindPrev(){
        if ( this.currentCode ){
          this.currentCode.widget.focus();
          this.currentCode.widget.execCommand('findPrev');
        }
      },
      codeFindNext(){
        if ( this.currentCode ){
          this.currentCode.widget.focus();
          this.currentCode.widget.execCommand('findNext');
        }
      },
      codeReplace(){
        if ( this.currentCode ){
          this.currentCode.widget.focus();
          this.currentCode.widget.execCommand('replace');
        }
      },
      codeReplaceAll(){
        if ( this.currentCode ){
          this.currentCode.widget.focus();
          this.currentCode.widget.execCommand('replaceAll');
        }
      },
      codeUnfoldAll(){
        if ( this.currentCode ){
          this.currentCode.unfoldAll();
        }
      },
      codeFoldAll(){
        if ( this.currentCode ){
          this.currentCode.foldAll();
        }
      },
    },
    mounted(){
      setTimeout(() => {
        if (!this.currentRep && this.ddRepData.length) {
          let dd = this.getRef('ddRep');
          dd.emitInput(this.ddRepData[0].value);
          this.$nextTick(() => {
            if (this.listRootProject.length) {
              this.getRef('ddRoot').emitInput(this.listRootProject[0].value);
            }
          })
        }
      }, 2000)
    },
    watch: {
      sourceParser(newVal, oldVal){
        if ( (newVal !== oldVal) && (newVal !== false) ){
          this.showTreeParser = false;
          this.$nextTick(()=>{
            this.showTreeParser = true;
          })
        }
        else{
          this.showTreeParser = false;
        }
      },
      currentRep(newVal, oldVal){
        if ( this.repositories[newVal] !== undefined ){
          if ( this.repositories[oldVal] && (this.repositories[newVal].alias_code !== this.repositories[oldVal].alias_code) ){
            this.typeProject = false;
            this.path = '';
          }

          if (!this.typeProject && this.listRootProject.length) {
            this.typeProject = this.listRootProject[0].value;
          }
          this.$nextTick(()=>{
            if ( newVal !== oldVal ){
              this.treeReload();
            }
          });
        }
      },
      typeProject(newVal){
        this.path= newVal;
        this.$nextTick(()=>{
          this.treeReload();
        });
      },
      showSearchContent(newVal){
        if ( newVal === true ){
          this.searchFile = "";
        }
      }
    }
  };
})();
