(() => {
  return {
    props: ['source'],
    data(){
      if ( this.source.repositories ){
        $.each(this.source.repositories, (i, a) => {
          a.value = i;
        });
      }
      return $.extend({}, this.source, {
        selected: 0,
        url: this.source.root + 'editor',
        path:'',
        lastRename: '',
        searchFile: '',
        //for search content
        search:{
          link: false,
          searchInRepository: '',
          caseSensitiveSearch: false,
          lastSearchRepository: ''
        },
        //for search content
        showSearchContent: false,
        cursorPosition:{
          line: 0,
          ch: 0
        },
        menu: [
          {
            text: 'File',
            items: [{
              text: '<i class="fas fa-plus"></i>' + bbn._('New'),
              items: [{
                text: '<i class="far fa-file"></i>' + bbn._('File'),
                select: () => {
                  this.newFile();
                }
              }, {
                text: '<i class="fas fa-folder"></i>' + bbn._('Directory'),
                select: () => {
                  this.newDir();
                },

              }]
            }, {
              text: '<i class="fas fa-save"></i>' + bbn._('Save'),
              //enabled: false,
              select: () => {
                this.save();
              },

            },{
              text: '<i class="fas fa-edit"></i>' + bbn._('Rename'),
              select: () => {
                this.rename(this.$refs.tabstrip['tabs'][this.$refs.tabstrip.selected], true);
              }
            },
              {
                text: '<i class="far fa-trash-alt"></i>' + bbn._('Delete'),
                select: () => {
                  this.deleteActive();
                }
              }, {
                text: '<i class="fas fa-times-circle"></i>' + bbn._('Close tab'),
                select: () => {
                  this.closeTab();
                }
              }, {
                text: '<i class="far fa-times-circle"></i>' + bbn._('Close all tabs'),
                select: () =>{
                  this.closeTabs();
                } //"bbn.ide.tabstrip.tabNav('closeAll');"
              }]
          }, {
            text: bbn._('Edit'),

            items: [{
              text: '<i class="fas fa-search"></i>' + bbn._('Find') + ' <small>CTRL+F</small>',
              select: () =>{
                this.codeSearch();
              }
            }, {
              text: '<i class="fas fa-search-plus"></i>' + bbn._('Find next') + ' <small>CTRL+G</small>',
              select: ()=>{
                this.codeFindNext();
              },
            }, {
              text: '<i class="fas fa-search-minus"></i>' + bbn._('Find previous') + ' <small>SHIFT+CTRL+G</small>',
              select: ()=>{
                this.codeFindPrev();
              }

            }, {
              text: '<i class="fas fa-exchange-alt"></i>' + bbn._('Replace') + ' <small>SHIFT+CTRL+F</small>',
              select: ()=>{
                this.codeReplace();
              }

            }, {
              text: '<i class="fas fa-retweet"></i>' + bbn._('Replace All') + ' <small>SHIFT+CTRL+R</small>',
              select: () =>{
                this.codeReplaceAll();
              },
            },{
              text: '<i class="fas fa-level-down-alt"></i>' + bbn._('Unfold all'),
              select: () =>{
                this.codeUnfoldAll();
              }
            },{
              text: '<i class="fas fa-level-up-alt"></i>' + bbn._('Fold all'),
              select: () =>{
                this.codeFoldAll();
              }
            }]
          }, {
            text: bbn._('History'),
            items: [{
              text: '<i class="fas fa-history"></i>' + bbn._('Show'),
              select: () => {
                this.history();
              }
            }, {
              text: '<i class="far fa-trash-alt"></i>' + bbn._('Clear'),
              select: 'bbn.ide.historyClear();',

            }, {
              text: '<i class="fas fa-trash"></i>' + bbn._('Clear All'),
              select: 'bbn.ide.historyClearAll();',

            }]
          }, {
            text: bbn._('Doc.'),
            items: [{
              text: '<i class="fas fa-binoculars"></i>' + bbn._('Find'),
            }, {
              text: '<i class="fas fa-book"></i>' + bbn._('Generate'),
            }]
          }/*, {
           text: 'Current',
           items: [{
           text: 'Add View'
           }, {
           text: 'Add Model'
           }, {
           text: 'Remove current'
           }]
           }*/, {
            text: bbn._('Pref.'),
            //enabled: false,
            items: [{
              text: '<i class="fas fa-cog"></i>' + bbn._('Manage directories'),
              select: ()=>{
                //for show Directories manager
                this.managerTypeDirectories();
              }
            }, {
              text: '<i class="fas fa-language"></i>' + bbn._('IDE style'),
              select: "bbn.ide.cfgStyle();",
            }]
          }
        ]
      })
    },
    computed: {
      typeSearch(){
        if( this.caseSensitiveSearch ){
          return bbn._('sensitive');
        }
        else{
          return bbn._('insensitive');
        }
      },
      tabSelected(){
        return this.$refs.tabstrip.selected;
      },
      currentURL(){
        return this.$refs.tabstrip.currentURL;
      },
      currentEditor(){
        if ( this.currentURL ){
          let idx = this.$refs.tabstrip.selected,
            codes = bbn.vue.findAll(this.$refs.tabstrip.getVue(idx), 'bbn-code'),
            code = false;
          $.each(codes, (i, a) => {
            if ( $(a.$el).is(":visible") ){
              code = a;
            }
          });
          return code;
        }
      },

      /**
       * Check if the current repository is a MVC
       *
       * @returns {boolean}
       */
      isMVC(){
        if( (this.repositories[this.currentRep] !== undefined ) &&
          (this.repositories[this.currentRep].tabs !== undefined) &&
          (this.repositories[this.currentRep].alias_code !== "component")
        ){
          return true;
        }
        return false;
      },
      treeInitialData(){
        return {
          repository: this.currentRep,
          repository_cfg: this.repositories[this.currentRep],
          is_mvc: this.isMVC,
          filter: this.searchFile,
          path: this.path,
          onlydirs: false,
          tab: false
        };
      },
      ddRepData(){
        const r = [];
        $.each(this.repositories, function(i, a){
          r.push({
            value: i,
            text: a.text
          });
        });
        return bbn.fn.order(r, "text");
      }
    },
    methods: {
      managerTypeDirectories(){
        bbn.fn.post(this.source.root + 'directories/data/types',(d)=>{
          if ( d.data.success ){
            bbn.vue.closest(this, ".bbns-tab").$refs.popup[0].open({
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
      searchOfContext(node){
        bbn.vue.closest(this, ".bbns-tab").$refs.popup[0].open({
          width: 400,
          height: 120,
          title: bbn._('Search in: ') + node.data.path,
          component: 'appui-ide-popup-search',
          source: {
            url: this.url,
            repository: node.data.repository,
            path: node.data.path
          }
        });

      },
      searchingContent(e){
        if( this.search.searchInRepository.length > 0 ){
          this.search.lastSearchRepository = this.search.searchInRepository;
          this.$nextTick(()=>{
            bbn.fn.link(this.url+'/search/'+ this.currentRep +'_end_/'+ this.typeSearch +'/'+ this.search.searchInRepository, true);
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
        let ctrlChangeCode = this.$refs.tabstrip.getVue(this.$refs.tabstrip.selected).$refs.component[0].changedCode,
          //method close of the tab selected
          closeProject =  this.$refs.tabstrip.getVue(this.$refs.tabstrip.selected).$parent.close;
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
        let ctrlChangeCode = this.$refs.tabstrip.getVue(this.$refs.tabstrip.selected).$refs.component[0].changedCode;
        if ( ctrlChangeCode ){
          appui.confirm(
            bbn._('Do you want to save the changes before closing the tab?'),
            () => {
              this.save( true );
              this.$refs.tabstrip.close(this.$refs.tabstrip.selected, true);
            },
            () => {
              this.$refs.tabstrip.close(this.$refs.tabstrip.selected, true);
              //this.afterCtrlChangeCode();
            }
          );
        }
        else {
          this.$refs.tabstrip.close(this.$refs.tabstrip.selected, true);
        }
      },
      /**
       * Check and close all tabs callback the function closeTab
       *
       */
      closeTabs(){
        let max= this.$refs.tabstrip.tabs.length;
        while(max !== 1){
          this.closeTab();
          max--;
        }
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
          $.extend(a, {
            repository: this.currentRep,
            repository_cfg: this.repositories[this.currentRep],
            onlydirs: false,
            tab: false,
            is_mvc: this.isMVC,
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
            icon: 'far fa-file',
            text: bbn._('New file'),
            command: (node) => {
              this.newFile(node)
            }
          }, {
            icon: 'far fa-folder',
            text: bbn._('New directory'),
            command: (node) => {
              this.newDir(node)
            }
          }, {
            icon: 'fas fa-edit',
            text: bbn._('Rename'),
            command: (node) => {
              this.rename(node)
            }
          }, {
            icon: 'far fa-copy',
            text: bbn._('Copy'),
            command: (node) => {
              this.copy(node)
            }
          },
          /*{
            icon: 'far fa-file-zip',
            text: bbn._('Export'),
            command: () => { this.export(n) }
          },*/ {
            icon: 'far fa-trash-alt',
            text: bbn._('Delete'),
            command: (node) => {
              this.deleteElement(node)
            }
          }
        ];
        if ( n.data.folder ){
          let obj = objContext.slice();
          obj.unshift({
            icon: 'fas fa-search',
            text: bbn._('Find in Path'),
            command: (node) => {
              this.searchOfContext(node)
            }
          });
          return obj;
        }
        else{
          let obj = objContext.slice();
          if ( this.isMVC ){
            let arr = [
              {
                icon: 'fas fa-external-link-alt',
                text: bbn._('Go to') + " CSS",
                color: "red",
                command: (node) => {
                  this.goToTab(node, "css")
                }
              },{
                icon: 'fas fa-external-link-alt',
                text: bbn._('Go to') + " Javascript",
                command: (node) => {
                  this.goToTab(node, "js")
                }
              },{
                icon: 'fas fa-external-link-alt',
                text: bbn._('Go to') + " View",
                command: (node) => {
                  this.goToTab(node, "html")
                }
              },{
                icon: 'fas fa-external-link-alt',
                text: bbn._('Go to') + " Model",
                command: (node) => {
                  this.goToTab(node, "model")
                }
              },{
                icon: 'fas fa-external-link-alt',
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
            icon: 'fas fa-magic',
            text: bbn._('Test code!'),
            command: ( node )=>{
              this.testNodeOfTree(node)
            }
          });
          return obj;
        }
      },
      goToTab(ele, tab){
        this.$refs.tabstrip.load(
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
        this.$refs.filesList.reload();
      },

      /**
       * Callback function triggered when you click on an item on the files|folders tree
       *
       * @param id
       * @param d The node data
       * @param n The node
       */
      treeNodeActivate(d){
        if ( !d.data.folder ){
          if( !this.isMVC && !this.existingTab(d)){
            bbn.fn.log(this.root + 'editor/file/' +  this.currentRep +  (d.data.path || '') +  '/_end_/code', d.data.path, "link")
            alert('ide');
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
      /**
       * Loads files|folders tree data
       *
       * @param n The tree node
       * @param onlyDirs Set true if you want to get only folders
       * @param tab The tab's name (MVC)
       * @returns {*}
       */
      /*     treeLoad(e, n, onlyDirs, tab){
       const vm = this;
       return bbn.fn.post(vm.root + "tree", {
       repository: vm.currentRep,
       repository_cfg: vm.repositories[vm.currentRep],
       is_mvc: vm.isMVC(),
       filter: vm.searchFile,
       path: n.node.data.path || '',
       onlydirs: onlyDirs || false,
       tab: tab || false
       }).promise().then((pd) => {
       return pd.data;
       });
       },*/

      /*link(link){
       console.log("link", link);
       this.$refs.tabstrip.load(link);
       },*/


      /**
       * Applies a filter to the tree and returns true if some items are shown and false otherwise
       * @todo fix it (remove kendo datasource)
       * @param dataSource the tree's dataSource
       * @param query the filter(s)
       * @param field the field on which applying filters (text by default)
       * @returns {boolean}
       */
      filterTree(dataSource, query, field){
        var vm = this,
          hasVisibleChildren = false,
          d = dataSource instanceof kendo.data.HierarchicalDataSource && dataSource.data();
        if ( !field ){
          field = "text";
        }
        for (var i = 0; i < d.length; i++) {
          var item = d[i];
          if ( item[field] ){
            var text = item[field].toLowerCase();
            var itemVisible =
              // parent already matches
              (query === true) ||
              // query is empty
              (query === "") ||
              // item text matches query
              (text.indexOf(query) >= 0);
            var anyVisibleChildren = vm.filterTree(item.children, itemVisible || query, field); // pass true if parent
            // matches
            hasVisibleChildren = hasVisibleChildren || anyVisibleChildren || itemVisible;
            item.hidden = !itemVisible && !anyVisibleChildren;
          }
        }
        if ( d ){
          // re-apply filter on children
          dataSource.filter({ field: "hidden", operator: "neq", value: true });
        }
        return hasVisibleChildren;
      },
      /** ###### TAB ###### */
      /*
       * check if what we are looking for is in the open tabs
       */
      existingTab(ele){
        let exist = false;
        for(let tab of this.$refs.tabstrip.tabs){
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
        let tab = file.data.tab === "php" ? '/settings' :  '/' + (file.data.tab !== false ? file.data.tab : 'code');
        this.$refs.tabstrip.load(
          'file/' +
          this.currentRep +
          (file.data.dir || '') +
          file.data.name +
          '/_end_' + tab
        );
      },
      getActive(getCode = false){
        let tn = this.$refs.tabstrip,
            code;
        if ( tn && tn.tabs[tn.selected] ){
          tn = tn.getSubTabNav(tn.selected);
          if ( !getCode ){
            return tn;
          }
          if ( tn && tn.tabs[tn.selected]  ){
            code = tn.getVue(tn.selected);
            if ( code.$children && code.$children[0] ){
              return code.$children[0];
            }
          }
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
              $.each(o.items, (i, v) => {
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
      setTheme(theme){
        $("div.code", this.$el).each((i, el) => {
          $(el).codemirror("setTheme", theme ? theme : this.theme);
        });
      },

      /**
       * Sets the font to editors
       * @param font
       * @param font_size
       */
      setFont(font, font_size){
        $("div.CodeMirror", this.$el).css("font-family", font ? font : this.font);
        $("div.CodeMirror", this.$el).css("font-size", font_size ? font_size : this.font_size);
      },

      /**
       * Evaluates a code, in different ways depending on its nature
       *
       * @returns {number}
       */
      test(){
        let  active = this.getActive(true);
        if ( active ){
          if ( this.isMVC ){
            let project =  active.rep.route ? active.rep.route + "/" : '';
            project += this.$refs.tabstrip.tabs[this.$refs.tabstrip.selected].title;
            bbn.fn.link( project, true );
          }
          else{
            active.test()
          }
        }
      },
      testNodeOfTree(node){
        if ( this.isMVC  ){
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
        bbn.fn.warning("active");
        bbn.fn.log("active", active);
        if ( active && $.isFunction(active.save) ){
          if( ctrl ){
            return active.save();
          }
          else{
            return active.save();
          }
        }
      },
      /**
       * Callback function triggered on tab close
       *
       * @param a
       * @param b
       * @param c
       */
      close: function(a, b, c){
        var vm = this;
        bbn.fn.log('close', $(vm.$refs.tabstrip).tabNav('getList'));
        bbn.fn.log(a,b,c);
      },

      /**
       * New file|directory dialog
       *
       * @param string title The dialog's title
       * @param bool isFile A boolean value to identify if you want create a file or a folder
       * @param string path The current path
       */
      new(title, isFile, node){
        let src = {
          allData: false,
          isFile: isFile,
          path: './',
          node: false,
          currentRep: this.currentRep,
          repositories: this.repositories,
          root: this.root,
          parent: false
        };
        if ( !node ){
          src.path = './'
        }
        else {
          if ( node.num > 0 ){
            if( !node.isExpanded ){
              node.isExpanded = true;
            }
            src.parent= bbn.vue.find(node, 'bbn-tree');
          }
          else{
            src.parent= node.parent;
          }

          if ( node.data.folder !== undefined ){
            if ( node.data.folder ){
              src.path = node.data.path;
            }
            else{
              if (node.level === 0 ){
                src.path = './';
              }
              else{
                let id = node.data.path.lastIndexOf("/");
                src.path = node.data.path.slice(0, id);
              }
            }
            src.allData = node.data;
          }
        }
        bbn.vue.closest(this, ".bbns-tab").$refs.popup[0].open({
          width: 500,
          height: 250,
          title: title,
          component: 'appui-ide-popup-new',
          source: src,
        });
      },

      /**
       * Opens a dialog for create a new file
       *
       * @param data The node data
       */
      newFile(node){
        this.new(bbn._('New File'), true, node != undefined && node ? node : false);
      },

      /**
       * Opens a dialog for create a new directory
       *
       * @param data The node data
       */
      newDir(node){
        this.new(bbn._('New Directory'), false, node != undefined && node ? node : false);
      },

      /**
       * Renames a file or a folder selected from the files list
       *
       * @param data The node data
       */
      rename(node, menuFile= false){
        //case of click rename in contextmenu of the tree
        if ( !menuFile ){
          var src = {
            nodeData: {
              folder: node.data.folder,
              ext: node.data.ext,
              path: node.data.path,
              name: node.data.name,
              tab: node.data.tab,
              dir: node.data.dir
            },
            parent: node.parent,
            isMVC: this.isMVC,
            root: this.source.root,
            currentRep: this.currentRep,
            repositories: this.repositories
          };
        }
        else{
          let tab = this.$refs.tabstrip.tabs[this.tabSelected].source,
            tabInfo = {
              mvc: tab.isMVC,
              name: !tab.isMVC ? tab.filename : tab.title.slice().substring(tab.title.lastIndexOf('/') + 1) ,
              path: !tab.isMVC ? tab.path : tab.title.slice().substring(0, tab.title.lastIndexOf('/') + 1),
              repository: tab.repository
            };
          var tabFile = tabInfo.name;
          var src = {
            nodeData:{
              folder: false,
              ext: !tabInfo.mvc ? this.$refs.tabstrip.tabs[this.tabSelected].source.ext : "",
              path: tabInfo.path,
              name: tabInfo.name,
              tab: tabFile,
            },
            isMVC: tabInfo.mvc,
            currentRep: tabInfo.repository,
            repositories: this.source.repositories,
            root: this.source.root,
            parent: false,
          }
        }
        bbn.vue.closest(this, ".bbns-tab").$refs.popup[0].open({
          width: 370,
          height: 150,
          title: bbn._('Rename'),
          component: 'appui-ide-popup-rename',
          source: src
        });
      },

      /**
       * Copies a file or a folder selected from the files list
       *
       * @param data The node data
       */
      copy(node){
        bbn.vue.closest(this, ".bbns-tab").$refs.popup[0].open({
          width: 370,
          height: 170,
          title: node.data.folder ? bbn._('Copy folder') : bbn._('Copy'),
          component: 'appui-ide-popup-copy',
          source: {
            data: node.data,
            currentRep: this.currentRep,
            repositories: this.source.repositories,
            root: this.source.root,
            isMVC: this.isMVC,
            config: this.source.config,
            parent: node.parent
          }
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

            //  bbn.fn.log("ddddd",node)    ;
            //node.$parent.reload();
          }break;
        }
      },
      /**
       * Deletes a file or a folder selected from the files list
       *
       * @param data The node data
       */
      deleteElement(node){
        appui.confirm(  bbn._('Are you sure you want to delete') +
          ( node.data.folder === true ? ' ' + bbn._('the folder') + ' ': ' ' ) +
          '<strong>' + node.data.name +  ' </strong>' + ' ?' ,
          () => {
            if (
              node &&
              node.data.name &&
              (node.data.dir !== undefined) &&
              (node.data.folder || (!node.data.folder && node.data.ext) )
            ){
              bbn.fn.post(this.root + 'actions/delete', {
                repository: this.repositories[this.currentRep],
                path: node.data.dir,
                name: node.data.name,
                ext: node.data.ext,
                is_file: !node.data.folder,
                is_mvc: this.isMVC
              }, (d) => {
                if ( d.success ){
                  const idx = this.$refs.tabstrip.getIndex('file/' + this.currentRep + node.data.dir + node.data.name);
                  // node = this.$refs.filesList.widget.getNodeByKey(data.key);
                  if ( idx != false ){
                    this.$refs.tabstrip.close(idx);
                  }
                  this.reloadAfterTree(node, 'delete');
                  appui.success(bbn._("Deleted!"));
                }
                else {
                  appui.error(bbn._("Error!"));
                }
              });
            }
          });
      },
      /**
       * Function for move node in tree
       */
      moveNode(a, select, dest){
        bbn.fn.log("ddddddd", select, dest);
        if ( dest.data.folder ){
          let path = select.data.path.split('/');
          path.pop();
          let selectPath = path.join('/'),
            obj = {
              new_name: select.data.name,
              is_file: !select.data.folder,
              ext: select.data.ext,
              path: selectPath + '/',
              new_path: dest.data.path,
              name: select.data.name,
              tab: select.data.tab,
              dir: select.data.dir,
              is_mvc: this.isMVC,
              root: this.source.root,
              repository: this.repositories[this.currentRep]
            };
          bbn.fn.post(this.root + 'actions/move', obj, (d) =>{
            if ( d.success ){
              let tabTitle = obj.path + obj.name,
                tabs = bbn.vue.findAll(appui.ide, 'bbns-tab');
              //if a node is moved from a tree and that it is open
              this.$nextTick(()=>{
                let idTab = bbn.fn.search(tabs, 'title', tabTitle);
                if( idTab > -1 ){
                  bbn.vue.find(appui.ide, 'bbn-tabnav').close(idTab);
                }
              });
              this.$nextTick(()=>{
                dest.parent.reload();
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
          this.$refs.filesList.reload();
        }
      },
      /**
       * Deletes the current opened file
       */
      deleteActive(){
        appui.confirm(bbn._('Are you sure you want to delete it?'), () => {
          const cont = this.$refs.tabstrip.getVue(this.$refs.tabstrip.selected);
          let f;

          /*  if ( cont && cont.$children[1] && cont.$children[1].$children[0] && cont.$children[1].$children[0].$data ){
           f = cont.$children[1].$children[0].$data;
           console.log("GUARDDDDDDAD", cont, f);
           alert("DELETE acTIVE");
           if ( f.filename &&
           f.path &&
           (f.isMVC !== undefined) &&
           f.repository &&
           this.repositories[f.repository]
           ){
           bbn.fn.post(this.root + 'actions/delete', {
           repository: this.repositories[f.repository],
           path: f.path,
           name: f.filename,
           ext: f.ext || false,
           is_file: true,
           is_mvc: f.isMVC
           }, (d) => {
           if ( d.success ){
           this.$refs.tabstrip.close(this.$refs.tabstrip.selected);
           appui.success(bbn._("Deleted!"));
           }
           else {
           appui.error(bbn._("Error!"));
           }
           });
           }
           }*/
          if ( cont && cont.$children[0] && cont.$children[0].$children[0] && cont.$children[0].$children[0].$data ){
            f = cont.$children[0].$children[0];

            if ( f.filename &&
              f.path &&
              (f.isMVC !== undefined) &&
              f.repository &&
              this.repositories[f.repository]
            ){
              bbn.fn.post(this.root + 'actions/delete', {
                repository: this.repositories[f.repository],
                path: f.path,
                name: f.filename,
                ext: f.ext || false,
                is_file: true,
                is_mvc: f.isMVC
              }, (d) => {
                if ( d.success ){
                  this.$refs.tabstrip.close(this.tabSelected);
                  appui.success(bbn._("Deleted!"));
                  // this.$refs.filesList.reload();
                }
                else {
                  appui.error(bbn._("Error!"));
                }
              });
            }
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

      },
      /** ###### I18N ###### */
      i18n(){
        let tabnav = appui.ide.$refs.tabstrip,
            tabnavActive = tabnav.activeTabNav,
            currentIde = tabnavActive.$parent,
            table_data  = [];

        bbn.fn.post( this.source.root + 'i18n/data/table', {
          table_path: currentIde.path ? currentIde.path : '',
          /** path of current repository */
          currentRep: this.currentRep,
          /** cfg of current repository */
          repository: this.repositories[currentIde.repository],
          ext: $.inArray(currentIde.ext, this.repositories[currentIde.repository].extensions) ? currentIde.ext : '',
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
      }

    },
    mounted(){
      bbn.fn.log('editor',this)
    },
    watch: {
      currentRep: function(newVal){
        this.treeReload();
      },
      showSearchContent: function(newVal){
        if ( newVal === true ){
          this.searchFile= "";
        }
      }
    },
    created(){
      appui.ide = this;
    }
  };
})();
