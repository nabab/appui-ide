(() => {
  return {
    props: ['source'],
    data(){
      if ( this.source.repositories ){
        bbn.fn.each(this.source.repositories, (a, i) => {
          a.value = i;
        });
      }
      //return $.extend({}, this.source, {
      return bbn.fn.extend({}, this.source, {      
        selected: 0,
        url: this.source.root + 'editor',
        path: '',
        lastRename: '',
        searchFile: '',
        tempNodeofTree: false,
        //for search content
        search:{
          link: false,
          searchInRepository: '',
          caseSensitiveSearch: false,
          lastSearchRepository: ''
        },
        typeProject: 'mvc',
        typeTree: false,
        //for search content
        showSearchContent: false,
        cursorPosition:{
          line: 0,
          ch: 0
        },
        menu: [{
          text: bbn._('File'),
          items: [{
            icon: 'nf nf-fa-plus',
            text: bbn._('New'),
            items: [{
              icon: 'nf nf-fa-file',
              text: bbn._('Element'),
              command: this.newElement
            }, {
              icon: 'nf nf-fa-folder',
              text: bbn._('Directory'),
              command: this.newDir
            }]
            }, {
              icon: 'nf nf-fa-save',
              text: bbn._('Save'),
              command: this.save
            }, {
              icon: 'nf nf-fa-edit',
              text: bbn._('Rename'),
              command: () => {
                this.rename(this.getRef('tabstrip')['tabs'][this.getRef('tabstrip').selected], true);
              }
            }, {
              icon: 'nf nf-fa-trash',
              text: bbn._('Delete'),
              command: this.deleteActive
            }, {
              icon: 'nf nf-fa-times_circle',
              text: bbn._('Close tab'),
              command: this.closeTab
            }, {
              icon: 'nf nf-fa-times_circle',
              text: bbn._('Close all tabs'),
              command: this.closeTabs
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
              command: this.codeSearch
            }, {
              icon: 'nf nf-fa-search_plus',
              text: bbn._('Find next') + ' <small>CTRL+G</small>',
              command: this.codeFindNext
            }, {
              icon: 'nf nf-fa-search_minus',
              text: bbn._('Find previous') + ' <small>SHIFT+CTRL+G</small>',
              command: this.codeFindPrev
            }, {
              icon: 'nf nf-fa-exchange',
              text: bbn._('Replace') + ' <small>SHIFT+CTRL+F</small>',
              command: this.codeReplace
            }, {
              icon: 'nf nf-fa-retweet',
              text: bbn._('Replace All') + ' <small>SHIFT+CTRL+R</small>',
              command: this.codeReplaceAll
            },{
              icon: 'nf nf-fa-level_down',
              text: bbn._('Unfold all'),
              command: this.codeUnfoldAll
            },{
              icon: 'nf nf-fa-level_up',
              text: bbn._('Fold all'),
              command: this.codeFoldAll
            }]
          }, {
            text: bbn._('History'),
            items: [{
              icon: 'nf nf-fa-history',
              text: bbn._('Show'),
              command: this.history
            }, {
              icon: 'nf nf-fa-trash',
              text: bbn._('Clear'),
              command(){
                if ( bbn.ide ){
                  return bbn.ide.historyClear();
                }
              }
            }, {
              icon: 'nf nf-fa-trash',
              text: bbn._('Clear All'),
              command(){
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
              command: this.managerTypeDirectories
            }, {
              icon: 'nf nf-fa-language',
              text: bbn._('IDE style'),
              command(){
                if ( bbn.ide ){
                  return bbn.ide.cfgStyle();
                }
              }
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
        runGetEditor: false,
        errorTreeParser: false,
        treeParser: false,
        readyMenu: false,        
        currentLine: 0,        
        disabledLine: true
      })
    },
    computed: {      
      listRootProject(){
        let roots = this.source.projects.roots.slice();
        //temporaney disabled
        // if ( this.currentRep.indexOf('BBN_LIB_PATH/bbn') !== -1){
        //   let i = bbn.fn.search(roots, 'value', 'lib');
        //   if ( i > -1 ){
        //     roots.splice(i, 1);
        //   }
        // }
        return roots;
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
      currentURL(){
        if ( this.getRef('tabstrip') ){          
          return this.getRef('tabstrip').currentURL;
        }
        return '';  
      },
      isSettings(){        
        return this.currentURL.indexOf("/_end_/settings") !== -1; 
      },      
      currentEditor(){        
        if ( this.runGetEditor || (this.currentURL !== false) ){
            let tabnav = this.$refs.tabstrip.getSubTabNav();        
            if ( tabnav ){
              let currentTab = tabnav.activeRealTab;
              if ( currentTab ){              
                if ( currentTab.find('appui-ide-code') ){
                  /*if ( this.errorTreeParser ){
                    this.$set(this,'errorTreeParser',false);  
                  }
                  this.$set(this,'sourceTreeParser',false);*/
                  return currentTab.find('bbn-code')
                }
              }            
            }          
        }
        return false;        
      },     
      currentId(){
        if ( this.currentEditor ){       
          return this.currentEditor.closest('appui-ide-code').source.id;
        }
        return false;
      },
      //temporanely name 
      possibilityParser(){
        if ( this.currentEditor ){          
          if ( this.currentEditor.closest('appui-ide-code').isClass ){
            return 'class';
          }
          else if ( this.currentEditor.closest('appui-ide-code').isComponent ){
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
          path: this.path,
          onlydirs: false,
          tab: false,
          is_project: this.isProject
        };

        if (this.isProject && (this.path.length === 0) ){
          obj.path = 'mvc';
          this.typeTree = 'mvc';
        }
        if ( this.typeTree !== false){
          obj.type = this.typeTree;
        }
        return obj;
      },
      ddRepData(){
        const r = [];
        bbn.fn.each(this.repositories, (a, i) => {
          r.push({
            value: i,
            text: a.text
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
      goToLine(){
        let lastLine = this.currentEditor.widget.lastLine(),
            line = this.currentLine;
        if ( line > lastLine ){
          line = lastLine;            
        }
        this.currentEditor.closest('appui-ide-code').goLine(line);
      },     
      selectRecentFile(file, obj){       
        this.getRef('tabstrip').load(obj.path);
      },
      setReadyMenu(){
        if ( !this.readyMenu ){
          this.readyMenu = true;
          this.$nextTick(()=>{
            this.getRecentFiles();
          });        
        }
      },
      getRecentFiles(){        
        this.post(this.root + 'editor/get_recent_files',{}, d=>{
          let menu = this.getRef('mainMenu').currentData[0]['data']['items'];
          if ( d.success ){
            let arr = [];
            bbn.fn.each(d.files, (v, i)=>{
              arr.push({
                icon: 'nf nf-fa-file_text',
                text: v.file,
                path: v.path,
                command: (v, i) =>{
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
          else{
            this.sourceTreeParser.idElement = this.currentId;
            this.treeParser = true;
          }
        }  
      },      
      parserComponent(){        
        if ( this.currentEditor &&
          (this.possibilityParser === "component") &&
          ( this.currentEditor.mode === "js")
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
              bbn.fn.log("aaadededede", obj)
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
      keydownFunction(event) {
        alert("dsds")
      },
      searchOfContext(node, component = false, is_vue = false){
        let title = bbn._('Search in') + ' : ' + node.data.path,
            path = node.data.path;
        if ( component ){
          title = bbn._('Search in') + ' : ' + node.data.name + ` <i class='nf nf-fa-vuejs'></i>`;
          if ( is_vue ){
            path = node.data.path.split('/');
            path.pop();
            path = path.join('/');
          }
        }
        this.getPopup().open({
          width: 500,
          height: 120,
          title: title,
          component: 'appui-ide-popup-search',
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
        if( this.search.searchInRepository.length > 0 ){
          let url = this.url+'/search/'+ this.currentRep,
          //for encode string in base64
          search = btoa(this.search.searchInRepository);

          //search in a project
          if ( this.isProject ){
            url += '_project_/' + this.typeProject + '/';
          }

          url += '_end_/' + this.typeSearch +'/'+ search;


          this.$nextTick(()=>{
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
       * Gets the bbn_path property from the current repository
       *
       * @returns string|boolean
       */
      getBbnPath(){
        const vm = this;
        if ( vm.repositories[vm.currentRep] &&
          vm.repositories[vm.currentRep].bbn_path
        ){
          return vm.repositories[vm.currentRep].bbn_path;
        }
        return false;
      },

      /**
       * Gets the path property from the current repository
       *
       * @returns string|boolean
       */
      getRepPath(){
        const vm = this;
        if ( vm.repositories[vm.currentRep] &&
          vm.repositories[vm.currentRep].path
        ){
          return vm.repositories[vm.currentRep].path;
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
        const vm = this;
        rep = rep || vm.currentRep;
        if ( tab && vm.repositories[rep] && vm.repositories[rep].tabs ){
          // Super controller
          if ( tab.indexOf('_ctrl') > -1 ){
            tab = '_ctrl';
          }
          if ( vm.repositories[rep].tabs[tab] && vm.repositories[rep].tabs[tab].path ){
            return vm.repositories[rep].tabs[tab].path;
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
        const vm = this;
        if ( vm.repositories[rep] ){
          // MVC
          if ( tab && vm.repositories[rep].tabs ){
            // Super controller
            if ( tab.indexOf('_ctrl') > -1 ){
              tab = '_ctrl';
            }
            if ( vm.repositories[rep].tabs[tab] && vm.repositories[rep].tabs[tab].extensions ){
              return vm.repositories[rep].tabs[tab].extensions;
            }
          }
          else if ( vm.repositories[rep].extensions ){
            return vm.repositories[rep].extensions;
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
        const vm = this;
        if ( vm.repositories[vm.currentRep] ){
          // MVC
          if ( tab && vm.repositories[vm.currentRep].tabs ){
            // Super controller
            if ( tab.indexOf('_ctrl') > -1 ){
              tab = '_ctrl';


            }
            if ( vm.repositories[vm.currentRep].tabs[tab] && vm.repositories[vm.currentRep].tabs[tab].extensions ){
              return bbn.fn.get_field(vm.repositories[vm.currentRep].tabs[tab].extensions, 'ext', ext, 'default');
            }
          }
          else if ( vm.repositories[vm.currentRep].extensions ){
            return bbn.fn.get_field(vm.repositories[vm.currentRep].extensions, 'ext', ext, 'default');
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
        // check if there are any changes in code
        let ctrlChangeCode = this.getRef('tabstrip').getVue(this.getRef('tabstrip').selected).getRef('component').changedCode,
          //method close of the tab selected
          closeProject =  this.getRef('tabstrip').getVue(this.getRef('tabstrip').selected).$parent.close;
        ev.preventDefault();
        if ( ctrlChangeCode ){
          appui.confirm(
            bbn._('Do you want to save the changes before closing the tab?'),
            () =>{
              this.save(true);
              setTimeout(()=>{
                closeProject(idx, true);
              }, 800)

            },
            () => {
              closeProject(idx, true);
            }
          );
        }
        else{
          closeProject(idx, true);
        }

      },
      /**
       * function to close the tab from the dropdown menu file
       *
       *
       */
      closeTab(){       
        //this.$nextTick(()=>{
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
                //this.afterCtrlChangeCode();
              }
            );
          }
          else {
            this.getRef('tabstrip').close(this.getRef('tabstrip').selected, true);
          }
        //})
      },
      /**
       * Check and close all tabs callback the function closeTab
       *
       */
      closeTabs(){
        //let max= this.getRef('tabstrip').tabs.length;
        this.$refs.tabstrip.closeAll();
       /* while(max !== 1){          
               
          this.closeTab();
            max--;
        }*/
      },
      /**
       * Makes a data object necessary on file actions
       *
       * @param rep The repository's name
       * @param tab The tab's name (MVC)
       * @returns {*}
       */
      makeActionData(rep, tab){
        const vm = this;
        if ( rep &&
          vm.repositories &&
          vm.repositories[rep] &&
          vm.repositories[rep].bbn_path &&
          vm.repositories[rep].path
        ){
          return {
            repository: rep,
            bbn_path: vm.repositories[rep].bbn_path,
            rep_path: vm.repositories[rep].path,
            tab_path: tab ? vm.getTabPath(tab, rep) : false,
            tab: tab || false,
            extensions: vm.getExt(rep, tab)
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
        if ( a.folder ){
          //$.extend(a, {
          bbn.fn.extend(a, {  
            repository: this.currentRep,
            repository_cfg: this.repositories[this.currentRep],
            onlydirs: false,
            tab: a.is_vue ? a.tab : false,
            tab_mvc: a.tab,
            root_project: a.root_project,
            is_mvc: this.isMVC,
            is_component: this.isComponent,
            is_project: this.isProject,
            filter: this.searchFile
          });
        }
        return a;
      },
      /**
       * function to define the context menu of each node of the tree
       *
       */
      treeContextMenu(n , i){
        let objContext = [
          {
            icon: n.data.type && n.data.type === 'components' ? 'nf nf-fa-vuejs' : 'nf nf-fa-file',
            text: n.data.type && n.data.type === 'components' ? bbn._('New component') : bbn._('New file'),
            command: (node) => {
              this.newElement(node)
            }
          }, {
            icon: 'nf nf-fa-folder',
            text: n.data.type === 'components' ? bbn._('New directory component') : bbn._('New directory'),
            command: (node) => {
              this.newDir(node)
            }
          }, {
            icon: 'nf nf-fa-edit',
            text: bbn._('Rename'),
            command: (node) => {
              this.rename(node)
            }
          }, {
            icon: 'nf nf-fa-copy',
            text: bbn._('Copy'),
            command: (node) => {
              this.copy(node)
            }
          }, {
            icon: 'nf nf-fa-trash',
            text: bbn._('Delete'),
            command: (node) => {
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
            command: node => {
              this.searchOfContext(node, true, true);
            }
          });
          objContext.push({
            icon: 'nf nf-fa-edit',
            text:  bbn._('Rename component vue'),
            command: node => {
              this.rename(node, false, true);
            }
          });
          objContext.push({
            icon: 'nf nf-fa-copy',
            text:  bbn._('Copy component vue'),
            command: node => {
              this.copy(node, true);
            }
          });
          objContext.push({
            icon: 'nf nf-fa-trash_alt',
            text:  bbn._('Delete component vue'),
            command: node => {
             this.deleteElement(node, true);
            }
          });
        }
        if ( n.data.folder ){
          let obj = objContext.slice();
          obj.unshift({
            icon: 'nf nf-fa-search',
            text: n.data.type && n.data.type === 'components' ? bbn._('Find in folder Component vue') : bbn._('Find in Path'),
            command: node => {
              let comp = n.data.type && n.data.type === 'components'  ? true : false;
              this.searchOfContext(node, comp, n.data.is_vue);
            }
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
                command: (node) => {
                  this.goToTab(node, "css")
                }
              },{
                icon: 'nf nf-fa-external_link',
                text: bbn._('Go to') + " Javascript",
                command: (node) => {
                  this.goToTab(node, "js")
                }
              },{
                icon: 'nf nf-fa-external_link',
                text: bbn._('Go to') + " View",
                command: (node) => {
                  this.goToTab(node, "html")
                }
              },{
                icon: 'nf nf-fa-external_link',
                text: bbn._('Go to') + " Model",
                command: (node) => {
                  this.goToTab(node, "model")
                }
              },{
                icon: 'nf nf-fa-external_link',
                text: bbn._('Go to') + " Controller",
                command: (node) => {
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
            command: ( node )=>{
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
              command:  node =>{
                let root = appui.plugins[bbn.fn.get_field(this.ddRepData, 'value', this.currentRep,'text')];
                root = root !== undefined ? root+'/' : '';
                bbn.fn.link('ide/profiler/url/'+ root + node.data.path);
                bbn.fn.log("PRofiling",'ide/profiler/url/'+ root + node.data.path)
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
        this.getRef('filesList').reload();
      },

      /**
       * Callback function triggered when you click on an item on the files|folders tree
       *
       * @param id
       * @param d The node data
       * @param n The node
       */
      treeNodeActivate(d){        
        if ( !d.data.folder || (d.data.folder && d.data.is_vue) ){
          if( !this.isProject && !this.isMVC && this.existingTab(d) ){
            bbn.fn.link(
              this.root + 'editor/file/' +
              this.currentRep +
              (d.data.path || '') +
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
        for(let tab of this.getRef('tabstrip').tabs){
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
          tab = file.data.tab === "php" ? '/settings' :  '/' + file.data.tab
          link = 'file/' +
            this.currentRep + 'mvc/' +
            (file.data.dir || '') +
            file.data.name +
            '/_end_' + (tab.indexOf('_') === 0 ? '/' + tab : tab);
        }
        else{
          link =  'file/' +  this.currentRep + file.data.path + '/_end_/' + (file.data.tab !== false ? file.data.tab : 'code');
        }        
        if ( link ){
          this.getRef('tabstrip').load(link);
        }
      },
      getActive(getCode = false){
        let tn = this.getRef('tabstrip');
        if ( tn && tn.tabs[tn.selected] ){
          if ( !getCode ){
            return tn.getSubTabNav(tn.selected);
          }
          return tn.router.getRealVue().find('appui-ide-code');
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
        const vm = this;
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
                st += vm.mkMenu(v);
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
       * Sets the theme to editors
       * @param theme
       */

      /*
      setTheme(theme){
        //$("div.code", this.$el).each((i, el) => {
        this.$el.querySelectorAll("div.code").each((i, el) => {
          el.codemirror("setTheme", theme ? theme : this.theme);
        });
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
      test(){
        //let is_component = this.getActive(true).rep['alias_code'] === 'components';

        let cp = this.getRef('tabstrip').router.getRealVue(),
            component = cp.closest('appui-ide-component');

        if ( component ){
          let url = component.closest('bbn-container').url,
              root = '',
              cp = '',
              foundComponents = false,
          // Removing file/ and /_end_
              bits = url.split('/');
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
          if ( cp ){
            let found = false;
            root = root.substr(0, root.length-1);
            cp = cp.substr(0, cp.length-1);
            if ( root === 'BBN_APP_PATH' ){
              found = bbn.env.appPrefix + '-' + cp;
            }
            else if ( root === 'BBN_CDN_PATH/lib/bbn-vue' ){
              found = 'bbn-' + cp;
            }
            else{
              bbn.fn.iterate(bbn.env.plugins, (a, n) => {
                if ( root.indexOf(n + '/src') > -1 ){
                  found = n + '-' + cp;
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
          bbn.fn.link( route + node.data.path, true );
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

      repositoryProject( type = false ){
        //let rep = $.extend({}, this.repositories[this.currentRep]);
        let rep = bbn.fn.extend({}, this.repositories[this.currentRep]);
        if ( !type ){
          type = this.typeTree
        }
        if ( this.source.projects.tabs_type[type] !== undefined && type !== 'lib' ){
          //return $.extend( rep, {tabs: this.source.projects.tabs_type[type][0]});
          return bbn.fn.extend(rep, {tabs: this.source.projects.tabs_type[type][0]});
        }
        else if ( this.source.projects.tabs_type[type] !== undefined && type === 'lib' ){
          //return $.extend(rep, {extensions: this.source.projects.tabs_type[type]['extensions']});
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
          repositoryProject: false,
          currentRep: this.currentRep,
          repositories: this.repositories,
          root: this.root,
          //parent: false,
          type: false,
          isProject: this.isProject
        };
        //case top menu

        if ( !bbn.fn.isObject(node) ){
          src.path = './'
          //case project
          if ( this.typeTree !== false ){
            src.type =  this.typeTree;
            if ( this.source.projects.tabs_type[this.typeTree] !== undefined ){
              src.repositoryProject = !this.repositoryProject(this.typeTree) ? this.repositories[this.currentRep] : this.repositoryProject(this.typeTree);
            }
            //src.path = this.typeTree === 'components' ? 'components_test' : this.typeTree;
            src.path = this.typeTree;
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
              if (  node.data.path.indexOf(node.data.dir + node.data.name + '/' + node.data.name) > -1 ){
                src.path = node.data.path.replace( node.data.dir + node.data.name + '/' + node.data.name,  node.data.dir + node.data.name);
              }
              else{
                src.path = node.data.path;
              }
            }//other types
            else{
              src.path = node.data.path;
            }
          }
          else{
            if ( node.data.folder ){
              src.path = node.data.path;
            }
          }
          src.allData = node.data;
        }

        if ( !bbn.fn.isObject(node) || node.data.folder ){
          //check path
          src.path = src.path.replace( '//',  '/');
          this.closest("bbn-container").getRef('popup').open({
            width: 500,
            height: 250,
            title: title,
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
          ((node.data.type !== false) || (this.typeTree !== false))
        ){
          if ( ((node !== false) && (node.data.type === 'components')) || (this.typeTree === 'components') ){
            title = bbn._('New Component') +  ` <i class='nf nf-fa-vuejs'></i>`;
          }
          else if ( ((node !== false) && (node.data.type === 'lib')) || (this.typeTree === 'lib') ){
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
      rename(node, menuFile= false, onlyComponent= false){
        //case of click rename in contextmenu of the tree
        let src = {},
            tab = false,
            title = '';
        //of context menu
        if ( !menuFile ){
          src = {
            nodeData: {
              folder: node.data.folder,
              ext: node.data.ext,
              path: node.data.path,
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
            is_project: this.isProject,
          };
          this.nodeParent = node.parent;
          if ( node.data.type === 'lib' ){
             let temp = node.data.dir.split('/');
             temp.shift();
             src.nodeData.type = temp.join('/');
          }
        }
        else{
          let tab = this.getRef('tabstrip').tabs[this.tabSelected].source,
              path = tab.path.split('/');
          
            path.shift();
          
         
          let filename = path.pop();          
          path = path.join('/');
          let  tabInfo = {
                mvc: tab.isMVC,
                isComponent: this.getActive(true).isComponent,
                //name: !tab.isMVC ? tab.filename : '',                
                //path: tab.isMVC ? tab.path : '',
                path: tab.isMVC ? path : '',
                name: !tab.isMVC ? tab.filename : filename,
                repository: tab.repository
              },
              tabFile = tabInfo.name;
          src = {
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
            repositories: this.source.repositories,
            root: this.source.root,
            parent: false,
            repository: this.repositories[this.currentRep],
            is_project: this.isProject,
          };
        }
        if ( this.isProject &&
          (( node.data !== undefined && node.data.type !== undefined && menuFile === false) ||
          (menuFile === true))
        ){

          if ( (tab !== false) && menuFile ){
            if ( tab.isMVC ){
              src.nodeData.type = "mvc";
            }
            else if ( tab.isComponent ){
              src.nodeData.type = 'components';
            }
            else{
              src.nodeData.type = 'lib';
            }
          }

          src.only_component = onlyComponent;
          //tree
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
              let filename = this.getRef('tabstrip').tabs[this.tabSelected].title;
              filename = filename.split('/');
              src.nodeData.name = filename.pop();
              src.nodeData.path = filename.join('/')+'/';
              src.nodeData.folder = true;
              src.repository = this.repositoryProject('components');
            }
          }
          if ( (node.data !== undefined  && node.data.is_vue === true) ||
          (menuFile && (this.getActive(true).isComponent)) ){
            let filename = this.getRef('tabstrip').tabs[this.tabSelected].title;
              filename = filename.split('/');
              filename.pop();
            src.nodeData.path = 'components/' + filename.join('/')+'/';
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
          title =  node.data.folder ? bbn._('Rename folder') : bbn._('REname');
        }
        
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
          repositories: this.source.repositories,
          repository: this.source.repositories[this.currentRep],
          root: this.source.root,
          isMVC: this.isMVC || node.data.type === 'mvc',
          isComponent: this.isComponent || node.data.type === 'components',
          config: this.source.config,
          isProject: this.isProject,
          type: this.typeTree
        //  parent: node.parent
        },
        title = '';
        if ( node.data.type === 'components' ){
          title = bbn._('Copy component');
        }
        else{
          title =  node.data.folder ? bbn._('Copy folder') : bbn._('Copy');
        }

        if ( (node.data.type !== undefined) && this.isProject ){
          src.only_component = onlyComponent;
          //src.repository = $.extend(this.repositories[this.currentRep], {tabs: this.source.projects.tabs_type[node.data.type][0]});
          src.repository = bbn.fn.extend(this.repositories[this.currentRep], {tabs: this.source.projects.tabs_type[node.data.type][0]});

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
            root: this.root,
            type: false,
            is_project: this.isProject
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
      moveNode(a, select, dest){
        bbn.fn.log("DEST", a, select,dest);
        if ( dest.data.folder ){
          let path = select.data.path.split('/'),
              new_path = dest.data.path,
              repositoryProject = false,
              isMVC = this.isMVC;

          path.pop();



          if ( this.isProject === true ){
            repositoryProject = !this.repositoryProject(this.typeTree) ? this.repositories[this.currentRep] : this.repositoryProject(this.typeTree);
            if ( (this.typeTree === 'components') &&
             ((select.data.type === 'components') && (dest.data.type === 'components'))
            ){
              path.pop();
              if ( dest.data.is_vue ){
                new_path = new_path.split('/');
                new_path.pop();
                new_path = new_path.join('/');
              }
            }
            else if( this.typeTree === 'mvc' ){
              isMVC = true;
            }
          }


          path = path.join('/');

          let obj = {
            new_name: select.data.name,
            is_file: !select.data.folder,
            is_project: this.isProject,
            type: this.isProject ? this.typeTree : false,
            is_component: this.typeTree === 'components' ? true : false,
            ext: select.data.ext,
            path: path + '/',
            new_path: new_path,
            name: select.data.name,
            tab: select.data.tab,
            dir: select.data.dir,
            is_mvc: isMVC,
            root: this.source.root,
            repository: !repositoryProject ? this.repositories[this.currentRep] : repositoryProject
          };


          this.post(this.root + 'actions/move', obj, (d) =>{
            if ( d.success ){
              let tabTitle = obj.path + obj.name,
                tabs = bbn.vue.findAll(appui.ide, 'bbn-container');

              if ( this.isProject ){
                tabTitle = obj.type + '/' + tabTitle;
              }
              //if a node is moved from a tree and that it is open
              this.$nextTick(()=>{
                let idTab = bbn.fn.search(tabs, 'title', tabTitle);

                if( idTab > -1 ){
                  bbn.vue.find(appui.ide, 'bbn-tabnav').close(idTab);
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
          this.getRef('filesList').reload();
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
            this.post(this.root + 'actions/delete', obj, (d) => {
              if ( d.success ){
                this.getRef('tabstrip').close(this.tabSelected);
                appui.success(bbn._("Deleted!"));
                 this.getRef('filesList').reload();
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
          tabNav.router.add({
            title: bbn._('History'),
            load: false,
            url: 'history',
            selected: true,
            component: 'appui-ide-history',
            source: tabNav.$parent.$data
          });
        }
        tabNav.selected = tabNav.router.getIndex('history');
        this.$nextTick(()=>{
          tabNav.router.activateIndex(tabNav.selected);
        });
      },
      /** ###### I18N ###### */
      i18n(){
        let tabnav = appui.ide.getRef('tabstrip'),
            tabnavActive = tabnav.activeTabNav,
            currentIde = tabnavActive.$parent,
            table_data  = [];

        this.post( this.source.root + 'i18n/data/table', {
          table_path: currentIde.path ? currentIde.path : '',
          /** path of current repository */
          currentRep: this.currentRep,
          /** cfg of current repository */
          repository: this.repositories[currentIde.repository],
          //ext: $.inArray(currentIde.ext, this.repositories[currentIde.repository].extensions) ? currentIde.ext : '',
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
        if ( this.currentEditor ){
          this.currentEditor.widget.focus();
          this.currentEditor.widget.execCommand('find');
        }
      },
      codeFindPrev(){
        if ( this.currentEditor ){
          this.currentEditor.widget.focus();
          this.currentEditor.widget.execCommand('findPrev');
        }
      },
      codeFindNext(){
        if ( this.currentEditor ){
          this.currentEditor.widget.focus();
          this.currentEditor.widget.execCommand('findNext');
        }
      },
      codeReplace(){
        if ( this.currentEditor ){
          this.currentEditor.widget.focus();
          this.currentEditor.widget.execCommand('replace');
        }
      },
      codeReplaceAll(){
        if ( this.currentEditor ){
          this.currentEditor.widget.focus();
          this.currentEditor.widget.execCommand('replaceAll');
        }
      },
      codeUnfoldAll(){
        if ( this.currentEditor ){
          this.currentEditor.unfoldAll();
        }
      },
      codeFoldAll(){
        if ( this.currentEditor ){
          this.currentEditor.foldAll();
        }
      },  
    },
    created(){
      appui.ide = this;
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
        if ( this.repositories[oldVal] && this.repositories[newVal].alias_code !== this.repositories[oldVal].alias_code ){
          this.typeTree = false;
          this.path = '';
        }       
        if ( newVal !== oldVal ){
          this.treeReload();
        }        
      },      
      typeProject(newVal, oldVal){
        this.path= newVal;        
        this.typeTree = newVal;
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