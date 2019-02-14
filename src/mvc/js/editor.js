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
        menu: [
          {
            text: 'File',
            items: [{
              text: '<i class="fas fa-plus"></i>' + bbn._('New'),
              items: [{
                text: '<i class="far fa-file"></i>' + bbn._('Element'),
                select: () => {
                  this.newElement();
                }
              },{
                text: '<i class="fas fa-folder"></i>' + bbn._('Directory'),
                select: () => {
                  this.newDir();
                }
              }]
            },{
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
                text: '<i class="fas fa-trash"></i>' + bbn._('Delete'),
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
              text: '<i class="far fa-trash"></i>' + bbn._('Clear'),
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
      listRootProject(){
        let roots = this.source.projects.roots.slice();
        if ( this.currentRep.indexOf('BBN_LIB_PATH/bbn') !== -1){
          let i = bbn.fn.search(roots, 'value', 'lib');
          if ( i > -1 ){
            roots.splice(i, 1);
          }
        }
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
        return !!(this.repositories[this.currentRep] &&
          this.repositories[this.currentRep].tabs &&
          (this.repositories[this.currentRep].alias_code === "mvc"));
      },
      isComponent(){
        return !!(this.repositories[this.currentRep] && (this.repositories[this.currentRep].alias_code === "components"));
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

        //bbn.fn.log("guarda11", this.isProject, )
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
        $.each(this.repositories, function(i, a){
          r.push({
            value: i,
            text: a.text
          });
        });
        return bbn.fn.order(r, "text");
      },
      // getTypesProject(){
      //   let types= false;
      //    if ( this.repositories[this.currentRep]['types'] !== 'undefiend' ){
      //       bbn.fn.post(this.root + 'get_types_repository',{repository: this.currentRep}, d => {})
      //    }
      //   else{
      //     types = false;
      //   }
      // },
    },
    methods: {
      managerTypeDirectories(){
        bbn.fn.post(this.source.root + 'directories/data/types',(d)=>{
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
          title = bbn._('Search in') + ' : ' + node.data.name + ` <i class='fab fa-vuejs'></i>`;
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
            //search = encodeURIComponent(this.search.searchInRepository);
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
            tab: a.is_vue ? a.tab : false,
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
            icon: n.data.type && n.data.type === 'components' ? 'fab fa-vuejs' : 'far fa-file',
            text: n.data.type && n.data.type === 'components' ? bbn._('New component') : bbn._('New file'),
            command: (node) => {
              this.newElement(node)
            }
          }, {
            icon: 'fas fa-folder',
            text: n.data.type === 'components' ? bbn._('New directory component') : bbn._('New directory'),
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
          }, {
            icon: 'fas fa-trash',
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
            icon: 'fas fa-search',
            text: bbn._('Find in Component vue'),
            command: node => {
              this.searchOfContext(node, true, true);
            }
          });
          objContext.push({
            icon: 'zmdi zmdi-edit',
            text:  bbn._('Rename component vue'),
            command: node => {
              this.rename(node, false, true);
            }
          });
          objContext.push({
            icon: 'zmdi zmdi-copy',
            text:  bbn._('Copy component vue'),
            command: node => {
              this.copy(node, true);
            }
          });
          objContext.push({
            icon: 'fas fa-trash-alt',
            text:  bbn._('Delete component vue'),
            command: node => {
             this.deleteElement(node, true);
            }
          });
        }
        if ( n.data.folder ){
          let obj = objContext.slice();
          obj.unshift({
            icon: 'fas fa-search',
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
        if ( !d.data.folder || (d.data.folder && d.data.is_vue) ){
          if( !this.isMVC && this.existingTab(d)){
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
          this.$refs.tabstrip.load(link);
        }
      },
      getActive(getCode = false){
        let tn = this.$refs.tabstrip,
          code;
        if ( tn && tn.tabs[tn.selected] ){
          tn = tn.getSubTabNav(tn.selected);
          if ( !getCode ){
            return tn;
          }
          //let tabnav = bbn.vue.closest(bbn.vue.find(this, 'appui-ide-code'), 'bbn-tabnav');

          return bbn.vue.find(this.getRef('tabstrip').getSubTabNav().activeRealTab, 'appui-ide-code');
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
       *
       */
      test(){
        this.getActive(true).test()
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
        if ( active && $.isFunction(active.save) ){
          return active.save();
        }
      },

      repositoryProject( type= false ){
        bbn.fn.log(type, "type");
        let rep = $.extend({}, this.repositories[this.currentRep]);
        if ( !type ){
          type = this.typeTree
        }
        if ( this.source.projects.tabs_type[type] !== undefined && type !== 'lib' ){
          return $.extend( rep, {tabs: this.source.projects.tabs_type[type][0]});
        }
        else if ( this.source.projects.tabs_type[type] !== undefined && type === 'lib' ){
          return $.extend(rep, {extensions: this.source.projects.tabs_type[type]['extensions']});
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
          parent: false,
          type: false,
          isProject: this.isProject
        };
        //case top menu

        if ( node === false ){
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
          if ( node.num > 0 ){
            if( !node.isExpanded ){
              node.isExpanded = true;
            }
            src.parent = bbn.vue.find(node, 'bbn-tree');
          }
          else{
            src.parent= node.parent;
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
        bbn.fn.log("new", node, src)

        if ( (node === false) || node.data.folder ){
          //check path
          src.path = src.path.replace( '//',  '/');
          bbn.vue.closest(this, ".bbns-tab").$refs.popup[0].open({
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
        if ( this.isProject &&
          ((node !== false) && (node.data.type !== false) || (this.typeTree !== false))
        ){
          if ( ((node !== false) && (node.data.type === 'components')) || (this.typeTree === 'components') ){
            title = bbn._('New Component') +  ` <i class='fab fa-vuejs'></i>`;
          }
          else if ( ((node !== false) && (node.data.type === 'lib')) || (this.typeTree === 'lib') ){
            title = bbn._('New Class');
          }
        }
        bbn.fn.log(title, true, node);

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
              dir: node.data.dir
            },
            parent: node.parent,
            isMVC: this.isProject && node.data.type === 'mvc' ? true : this.isMVC,
            isComponent: this.isProject && node.data.type === 'components' ? true : this.isComponent,
            root: this.source.root,
            currentRep: this.currentRep,
            repositories: this.repositories,
            repository: this.repositories[this.currentRep]
          };
        }
        else{
          let tab = this.getRef('tabstrip').tabs[this.tabSelected].source,
              tabInfo = {
                mvc: tab.isMVC,
                isComponent: this.getActive(true).isComponent,
                name: !tab.isMVC ? tab.filename : '',
                path: tab.isMVC ? tab.path : '',
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
            repository: this.repositories[this.currentRep]
          };
        }
        if ( this.isProject &&
          (( node.data !== undefined && node.data.type !== undefined && menuFile === false) ||
          (menuFile === true))
        ){
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

        /*if ( node.data.type !== undefined && this.isProject ){
          src.only_component = onlyComponent;
          src.repository = $.extend(this.repositories[this.currentRep], {tabs: this.source.projects.tabs_type[node.data.type][0]});

          if ( node.data.is_vue === true ){
            src.component_vue = true;
          }

        }
        else{
          title = node.data.folder ? bbn._('Copy folder') : bbn._('Copy');
        }*/

      },

      /**
       * Copies a file or a folder selected from the files list
       *
       * @param data The node data
       */
      copy(node, onlyComponent= false){
        let src = {
          data: node.data,
          currentRep: this.currentRep,
          repositories: this.source.repositories,
          root: this.source.root,
          isMVC: this.isMVC || node.data.type === 'mvc',
          isComponent: this.isComponent || node.data.type === 'components',
          config: this.source.config,
          parent: node.parent
        },
        title = '';
        if ( node.data.type === 'components' ){
          title = bbn._('Copy component');
        }
        else{
          title =  node.data.folder ? bbn._('Copy folder') : bbn._('Copy');
        }

        if ( node.data.type !== undefined && this.isProject ){
          src.only_component = onlyComponent;
          src.repository = $.extend(this.repositories[this.currentRep], {tabs: this.source.projects.tabs_type[node.data.type][0]});

          if ( node.data.is_vue === true ){
            src.component_vue = true;
          }

        }
        else{
          title = node.data.folder ? bbn._('Copy folder') : bbn._('Copy');
        }

        bbn.vue.closest(this, ".bbns-tab").$refs.popup[0].open({
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
            root: this.root
          },
          text = "";
          if ( (node.data.type !== undefined) && this.isProject ){
            src.only_component = onlyComponent;
            src.repository = !this.repositoryProject(node.data.type) ? this.repositories[this.currentRep] : this.repositoryProject(node.data.type);

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


          // if ( node.data.type === undefined  ||
          //   (!node.data.type) ||
          //   ((node.data.type !== 'mvc') || (node.data.type !== 'components'))
          // ){
          //   appui.confirm( text, () => {
          //     bbn.fn.post(this.root + 'actions/delete', src, (d) => {
          //       if ( d.success ){
          //         const idx = this.$refs.tabstrip.getIndex('file/' + this.currentRep + node.data.dir + node.data.name);
          //         if ( idx != false ){
          //           this.$refs.tabstrip.close(idx);
          //         }
          //         this.reloadAfterTree(node, 'delete');
          //         appui.success(bbn._("Deleted!"));
          //       }
          //       else {
          //         appui.error(bbn._("Error!"));
          //       }
          //     });
          //   });
          // }
          // else{
            let title = src.is_file ? bbn._('Remove File') : bbn._('Remove Folder');
            this.tempNodeofTree = node;
            this.getPopup().open({
              width: 450,
              title: node.data.type === 'components' && node.data.is_vue ? bbn._('Remove Component') : title,
              height: 250,
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
        if ( dest.data.folder ){
          let path = select.data.path.split('/'),
              new_path = dest.data.path,
              repositoryProject = false,
              isMVC = this.isMVC;

          path.pop();



          if ( this.isProject === true ){
            repositoryProject = !this.repositoryProject(this.typeTree) ? this.repositories[this.currentRep] : this.repositoryProject(this.typeTree);
            /*if ( ((this.typeTree === 'components') || (this.typeTree === 'components_test')) &&
             ((select.data.type === 'components') && (dest.data.type === 'components'))
           ){*/
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


      //    bbn.fn.log("move", obj);
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
            bbn.fn.post(this.root + 'actions/delete', obj, (d) => {
              if ( d.success ){
                this.getRef('tabstrip').close(this.tabSelected);
                appui.success(bbn._("Deleted!"));
                 this.$refs.filesList.reload();
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
      },


    },
    mounted(){
      bbn.fn.log('editor',this)
    },
    watch: {
      currentRep(newVal, oldVal){
        if ( this.repositories[oldVal] && this.repositories[newVal].alias_code !== this.repositories[oldVal].alias_code ){
          this.typeTree = false;
          this.path = '';
        }
        /*
        if (this.source.default_repository !== newVal ){
          this.typeTree = false;
          this.path = '';
        }
        else if ( newVal === this.source.default_repository ){
          this.typeTree = this.typeProject;
          this.path = this.typeProject;
        }
        this.treeReload();*/
        if ( newVal !== oldVal ){
          this.treeReload();
        }
      },
      typeProject(newVal, oldVal){
        this.path= newVal;
        //this.typeTree = newVal === 'components_test' ?  'components' : newVal;
        this.typeTree = newVal;
        this.$nextTick(()=>{
          this.treeReload();
        });
      },
      showSearchContent(newVal){
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
