(() => {
  return {
    beforeMount(){
      bbn.vue.setComponentRule(this.source.root + 'components/', 'appui');
      bbn.vue.addComponent('ide/history');
      bbn.vue.addComponent('ide/popup/new');
      bbn.vue.addComponent('ide/popup/rename');
      bbn.vue.unsetComponentRule();
    },
    props: ['source'],
    data(){
      const vm = this;
      if ( vm.source.repositories ){
        $.each(vm.source.repositories, function (i, a){
          a.value = i;
        });
      }
      return $.extend({}, vm.source, {
        selected: 0,
        url: vm.source.root + 'editor',
        searchFile: '',
        menu: [
          {
            text: 'File',
            items: [{
              text: '<i class="fa fa-plus"></i>New',
              items: [{
                text: '<i class="fa fa-file-o"></i>File',
                select(){
                  vm.newFile();
                }
              }, {
                text: '<i class="fa fa-folder"></i>Directory',
                select(){
                  vm.newDir();
                }
              }]
            }, {
              text: '<i class="fa fa-save"></i>Save',
              select(){
                vm.save();
              }
            }, {
              text: '<i class="fa fa-trash-o"></i>Delete'
            }, {
              text: '<i class="fa fa-times-circle"></i>Close',
              select: "bbn.ide.tabstrip.tabNav('close');"
            }, {
              text: '<i class="fa fa-times-circle-o"></i>Close all tabs',
              select: "bbn.ide.tabstrip.tabNav('closeAll');"
            }]
          }, {
            text: 'Edit',
            items: [{
              text: '<i class="fa fa-search"></i>Find <small>CTRL+F</small>',
              select: "bbn.ide.search();"
            }, {
              text: '<i class="fa fa-search-plus"></i>Find next <small>CTRL+G</small>',
              select: "bbn.ide.findNext();"
            }, {
              text: '<i class="fa fa-search-minus"></i>Find previous <small>SHIFT+CTRL+G</small>',
              select: "bbn.ide.findPrev();"
            }, {
              text: '<i class="fa fa-exchange"></i>Replace <small>SHIFT+CTRL+F</small>',
              select: "bbn.ide.replace();"
            }, {
              text: '<i class="fa fa-retweet"></i>Replace All <small>SHIFT+CTRL+R</small>',
              select: "bbn.ide.replaceAll();"
            }]
          }, {
            text: 'History',
            items: [{
              text: '<i class="fa fa-history"></i>Show',
              select: 'bbn.ide.history();'
            }, {
              text: '<i class="fa fa-trash-o"></i>Clear',
              select: 'bbn.ide.historyClear();'
            }, {
              text: '<i class="fa fa-trash"></i>Clear All',
              select: 'bbn.ide.historyClearAll();'
            }]
          }, {
            text: 'Doc.',
            items: [{
              text: '<i class="fa fa-binoculars"></i>Find'
            }, {
              text: '<i class="fa fa-book"></i>Generate'
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
            text: 'Pref.',
            items: [{
              text: '<i class="fa fa-cog"></i>Manage directories',
              select: "bbn.ide.cfgDirs();"
            }, {
              text: '<i class="fa fa-language"></i>IDE style',
              select: "bbn.ide.cfgStyle();"
            }]
          }
        ]
      })
    },
    computed: {
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
       * Check if the current repository is a MVC
       *
       * @returns {boolean}
       */
      isMVC(){
        const vm = this;
        return (vm.repositories[vm.currentRep] !== undefined ) && (vm.repositories[vm.currentRep].tabs !== undefined);
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
       * Loads files|folders tree data
       *
       * @param n The tree node
       * @param onlyDirs Set true if you want to get only folders
       * @param tab The tab's name (MVC)
       * @returns {*}
       */
      treeLoad(e, n, onlyDirs, tab){
        const vm = this;
        return bbn.fn.post(vm.root + "tree/", {
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

      /**
       * Callback function triggered when an files|folders tree item is rendered
       * @param e
       * @param d
       */
      treeRenderNode(e, d){
        if ( d.node.data.bcolor ){
          $("span.fancytree-custom-icon", d.node.span).css("color", d.node.data.bcolor);
        }
      },

      /**
       * Callback function triggered when you click on an item on the files|folders tree
       *
       * @param id
       * @param d The node data
       * @param n The node
       */
      treeNodeActivate(id, d, n){
        const vm = this;
        if ( !n.folder ){
          vm.openFile(d);
        }
      },

      /**
       * Callback function triggered when you expand a files|folders tree node
       *
       * @param e
       * @param d
       */
      treeLazyLoad(e, d){
        const vm = this;
        d.result = vm.treeLoad(e, d);
      },


      /** ###### TAB ###### */

      /**
       * Adds a file (tab) to the tabNav
       *
       * @param tabnav
       * @param file
       */
      openFile(file){
        const vm = this;
        bbn.fn.log(file,
          vm.root +
          'editor/file/' +
          vm.currentRep +
          (file.dir || '') +
          file.name +
          '/_end_' +
          (file.tab ? '/' + file.tab : '')
        );
        bbn.fn.link(
          vm.root +
          'editor/file/' +
          vm.currentRep +
          (file.dir || '') +
          file.name +
          '/_end_' +
          (file.tab ? '/' + file.tab : '')
        );
      },

      getActive(){
        const vm = this;
        let tn = vm.$refs.tabstrip,
            code;
        if ( tn && tn.currentURL ){
          tn = tn.getSubTabNav(tn.getIndex(tn.currentURL));
          if ( tn && tn.currentURL ){
            code = tn.getContainer(tn.getIndex(tn.currentURL));
            if ( code.$children[0] ){
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

      /**
       * Make a codemirror editor
       *
       * @param c The tab page's container
       * @param d The tab page's data
       */
      mkCodeMirror(c, d){
        const vm = this;
        let $cm;
        if ( d.tab && (d.tab === 'php') ){
          vm.permissionsPanel(c, d);
        }
        $cm = $("div.code", c).codemirror({
          mode: d.mode,
          value: d.value,
          selections: d.selections,
          marks: d.marks,
          save: vm.save,
          keydown(widget, e){
            if ( e.ctrlKey && e.shiftKey && (e.key.toLowerCase() === 't') ){
              e.preventDefault();
              vm.test();
            }
          },
          changeFromOriginal(wid){
            const $elem = wid.element,
                idx = $elem.closest("div[role=tabpanel]").index() - 1;
            if ( wid.changed ){
              //$elem.closest("div[data-role=tabstrip]").find("> ul > li").eq(idx).addClass("changed");
              $elem.closest("div[data-role=reorderabletabstrip]").find("> ul > li").eq(idx).addClass("changed");
              $($(vm.$refs.tabstrip).tabNav('getTab', $(vm.$refs.tabstrip).tabNav('getActiveTab'))).addClass("changed");
            }
            else {
              let ok = true;
              //$elem.closest("div[data-role=tabstrip]").find("> ul > li").eq(idx).removeClass("changed");
              $elem.closest("div[data-role=reorderabletabstrip]").find("> ul > li").eq(idx).removeClass("changed");
              //$elem.closest("div[data-role=tabstrip]").find("> ul > li").each(function(i, e){
              $elem.closest("div[data-role=reorderabletabstrip]").find("> ul > li").each((i, e) => {
                if ( $(e).hasClass("changed") ){
                  ok = false;
                }
              });
              if ( ok ){
                $($(vm.$refs.tabstrip).tabNav('getTab', $(vm.$refs.tabstrip).tabNav('getActiveTab'))).removeClass("changed");
              }
            }
          }
        });
        if ( d.file.id ) {
          const $link = $("div.ui-codemirror[data-id='" + d.file.id + "']").first();
          if ( $link.length ){
            $cm.codemirror("link", $link);
          }
          $cm.attr("data-id", d.file.id);
        }
      },

      /**
       * Sets the theme to editors
       * @param theme
       */
      setTheme(theme){
        const vm = this;
        $("div.code", ele).each(() => {
          $(this).codemirror("setTheme", theme ? theme : vm.theme);
        });
      },

      /**
       * Sets the font to editors
       * @param font
       * @param font_size
       */
      setFont(font, font_size){
        $("div.CodeMirror", ele).css("font-family", font ? font : this.font);
        $("div.CodeMirror", ele).css("font-size", font_size ? font_size : this.font_size);
      },

      /**
       * Evaluates a code, in different ways depending on its nature
       *
       * @returns {number}
       */
      test(){
        const vm = this,
              active = vm.getActive();

        if ( active && $.isFunction(active.test) ){
          active.test();
        }
      },

      /**
       * Saves the currently visible codemirror instance
       *
       * @returns {number}
       */
      save: function(){
        const vm = this,
              active = vm.getActive();

        if ( active && $.isFunction(active.save) ){
          active.save();
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
      new(title, isFile, path){
        const vm = this;
        appui.popup({
          width: 850,
          height: 600,
          title: title,
          component: 'appui-ide-popup-new',
          source: vm.$data
        });



      },

      /**
       * Opens a dialog for create a new file
       *
       * @param string path The current path
       */
      newFile(path){
        this.new(bbn._('New File'), true, path);
      },

      /**
       * Opens a dialog for create a new directory
       *
       * @param string path The current path
       */
      newDir(path){
        this.new(bbn._('New Directory'), false, path);
      },



      /** ###### HISTORY ###### */
      history: function(){
        /*var obj = bbn.ide.tabstrip.tabNav("getObs"),
         // tab config
         hist = {
         title: 'History',
         url: 'history',
         bcolor: '',
         fcolor: '',
         menu: [{
         text: 'Switch to Diff mode',
         fn: function(e){
         var $code = $("div.bbn-ide-history-code", cont),
         tree = $("div.bbn-ide-history-tree", cont).data("kendoTreeView"),
         item = tree.select().length ? tree.dataItem(tree.select()) : false;
         if ( item && item.tab !== undefined ){
         var c = subTab.tabNav('getContainer', subTab.tabNav('search', item.tab)),
         orig = $("div.bbn-code.ui-codemirror", c).codemirror("getValue");
         }
         $code.children().remove();
         $code.removeClass("ui-codemirror");
         $code.codemirror('mergeView', {
         value: orig ? orig : '',
         mode: item ? item.mode : '',
         origRight:  item ? item.code : '',
         allowEditingOriginals: false,
         showDifferences: true,
         readOnly: true
         });
         $code.children().addClass("bbn-full-height");
         $("div.bbn-codeMirror-merge-pane", $code).not(".CodeMirror-merge-pane-rightmost").before(
         '<div style="border-bottom: 1px solid #ddd">' +
         '<div class="bbn-c" style="width: 50%; display: inline-block"><strong>CURRENT CODE</strong></div>' +
         '<div class="bbn-c" style="width: 50%; display: inline-block"><strong>BACKUP CODE</strong></div>' +
         '</div>'
         );
         $code.redraw();
         }
         }],
         callonce: function(){
         getData();
         }
         },
         subTab = bbn.ide.tabstrip.tabNav("getSubTabNav", obj.url),
         idx = subTab.tabNav('search', hist.url),
         treeDS = new kendo.data.HierarchicalDataSource({
         data: []
         }),
         cont,
         getData = function(){
         bbn.fn.post(data.root + 'history/load', { url: obj.url }, function(d){
         if ( d.data.list !== undefined ){
         // Set new data to datasource
         treeDS.data(d.data.list);
         // Resize splitter
         $("div.bbn-ide-history-splitter", cont).data("kendoSplitter").resize();
         // Reset CodeMirror
         $("div.bbn-ide-history-code", cont).codemirror("setValue", '');
         }
         });
         };

         if ( idx === -1 ){
         // Insert the new tab history
         subTab.tabNav('add', hist);
         // Get the tab's index
         var idx = subTab.tabNav('getIndex', hist.url),
         // Get container
         cont = subTab.tabNav('getContainer', idx);

         // Insert html template to container
         $(cont).html($(ide_history_template).html());
         // Splitter
         $("div.bbn-ide-history-splitter", cont).kendoSplitter({
         panes: [{
         collapsible: true,
         size: '150px'
         }, {
         collapsible: false
         }]
         }).data("kendoSplitter");
         // Date tree
         $("div.bbn-ide-history-tree", cont).kendoTreeView({
         dataSource: treeDS,
         select: function(e){
         var item = e.sender.dataItem(e.node),
         $cm = $("div.bbn-ide-history-code", cont);
         if ( (item.code !== undefined) &&
         (item.mode !== undefined)
         ){
         if( $cm.children().hasClass("CodeMirror-merge") ){
         if ( item.tab !== undefined ){
         var c = subTab.tabNav('getContainer', subTab.tabNav('search', item.tab)),
         orig = $("div.bbn-code.ui-codemirror", c).codemirror("getValue");
         }
         $cm.children().remove();
         $cm.codemirror('mergeView', {
         value: orig,
         mode: item.mode,
         origRight: item.code,
         allowEditingOriginals: false,
         showDifferences: true,
         readOnly: true
         });
         $cm.children().addClass("bbn-full-height");
         $("div.bbn-codeMirror-merge-pane", $cm).not(".CodeMirror-merge-pane-rightmost").before(
         '<div style="border-bottom: 1px solid #ddd">' +
         '<div class="bbn-c" style="width: 50%; display: inline-block"><strong>CURRENT CODE</strong></div>' +
         '<div class="bbn-c" style="width: 50%; display: inline-block"><strong>BACKUP CODE</strong></div>' +
         '</div>'
         );
         $cm.redraw();
         }
         else {
         $cm.codemirror("setOption", 'mode', item.mode);
         $cm.codemirror("setValue", item.code);
         }
         }
         }
         });
         }
         else {
         // Get container
         cont = subTab.tabNav('getContainer', idx);
         // Get data
         getData();
         // Set new data to tree
         $("div.bbn-ide-history-tree", cont).data("kendoTreeView").setDataSource(treeDS);
         }
         // Activate history tab
         subTab.tabNav('activate', idx);
         // CodeMirror
         $("div.bbn-ide-history-code", cont).codemirror({
         readOnly: true
         });
         },

         historyClear: function(){
         bbn.fn.post(data.root + 'history/clear', {
         url: bbn.ide.tabstrip.tabNav("getObs").url
         }, function(d){
         if ( d.data.success !== undefined ){
         appui.success("History cleared!");
         }
         });
         },

         historyClearAll: function(){
         bbn.fn.post(data.root + 'history/clear', {}, function(d){
         if ( d.data.success !== undefined ){
         appui.success("History cleared!");
         }
         });*/
      },

    },
    watch: {
      currentRep: function(newVal){
        this.$refs.filesList.widget.reload();
      }
    },
    mounted: function(){
      const vm = this;
      vm.$nextTick(() => {
        $(vm.el).bbn('analyzeContent', true);
      });

      // Toolbar with buttons and menu
      /*$("div.bbn-ide", $(vm.$el)).kendoToolBar({
       items: [{
       template: '<input class="k-textbox ide-tree-search" type="text" placeholder="Search file">'
       }, {
       type: "separator"
       }, {
       template: '<input class="ide-rep-select">'
       }, {
       type: "separator"
       }, {
       template: '<button class="k-button" title="Test code!" onclick="bbn.ide.test();"><i class="fa fa-magic">' +
       ' </i></button>'
       }, {
       template: '<button class="k-button" title="Show History" onclick="bbn.ide.history();"><i class="fa fa-history"> </i></button>'
       }, {
       type: "separator"
       }, {
       template: function () {
       var st = '<ul class="menu">';
       $.each(vm.menu, function (i, v) {
       st += vm.mkMenu(v);
       });
       st += '</ul>';
       return st;
       }
       }]
       });*/
      /*

       // Menu inside toolbar
       $("ul.menu", $(vm.$el)).kendoMenu({
       direction: "bottom right"
       }).find("a").on("mouseup", function(){
       $(this).closest("ul.menu").data("kendoMenu").close();
       });

       // Search field
       $("input.ide-tree-search", $(vm.$el)).on('keyup', function(){
       vm.searchFile = $(this).val();
       vm.filterTree(treeDS, $(this).val().toString().toLowerCase(), "name");
       });

       // Repositories dropDownList
       vm.repSelect = $("input.ide-rep-select", $(vm.$el)).kendoDropDownList({
       dataSource: [],
       dataTextField: "text",
       dataValueField: "value",
       change: function(e){
       var sel = e.sender.dataItem();
       if ( sel && sel.bcolor ) {
       e.sender.wrapper.find(".k-input").css({backgroundColor: sel.bcolor});
       }
       if ( sel && sel.fcolor ){
       e.sender.wrapper.find(".k-input").css({color: sel.fcolor});
       }
       if ( vm.currentRep !== e.sender.value() ){
       vm.currentRep = e.sender.value();
       }
       }
       }).data("kendoDropDownList");

       // Calling source for dropdown
       vm.repDropDownSource();

       // Menu on tree's items
       $("ul.bbn-ide-context").kendoContextMenu({
       orientation: 'vertical',
       target: vm.tree,
       filter: "span.k-in",
       animation: {
       open: {effects: "fadeIn"},
       duration: 500
       },
       dataSource: [{
       text: '<i class="fa fa-plus"></i>New',
       cssClass: "bbn-tree-new-dir",
       encoded: false,
       items: [{
       text: '<i class="fa fa-file-o"></i>File',
       cssClass: "bbn-tree-new-file",
       encoded: false
       }, {
       text: '<i class="fa fa-folder"></i>Directory',
       cssClass: "bbn-tree-new-dir",
       encoded: false
       }]
       }, {
       text: '<i class="fa fa-files-o"></i>Duplicate',
       cssClass: "bbn-tree-duplicate",
       encoded: false
       }, {
       text: '<i class="fa fa-file-archive-o"></i>Export',
       cssClass: "bbn-tree-export",
       encoded: false
       }, {
       text: '<i class="fa fa-pencil"></i>Rename',
       cssClass: "bbn-tree-rename",
       encoded: false
       }, {
       text: '<i class="fa fa-trash-o"></i>Delete',
       cssClass: "bbn-tree-delete",
       encoded: false
       }, {
       text: '<i class="fa fa-refresh"></i>Refresh',
       cssClass: "bbn-tree-refresh",
       encoded: false
       }],
       select: function (e) {
       var msg,
       treeview = vm.tree.data("kendoTreeView"),
       item = $(e.target).closest("li"),
       dataItem = treeview.dataItem(item);
       if ($(e.item).hasClass("bbn-tree-refresh")) {
       dataItem.loaded(false);
       treeview.one("dataBound", function (e) {
       e.sender.expandPath([dataItem.path]);
       });
       dataItem.load();
       }
       else if ($(e.item).hasClass("bbn-tree-new-dir")) {
       if (dataItem.type === 'dir') {
       var parent = dataItem,
       path = dataItem.path;
       }
       else {
       var parent = dataItem.parentNode(),
       path = dataItem.path.substr(0, dataItem.path.lastIndexOf('/'));
       }
       if (!path) {
       path = './';
       parent = {};
       }
       vm.newDir(path, parent.uid || '');
       }
       else if ($(e.item).hasClass("bbn-tree-new-file")) {
       var path = dataItem.type === 'dir' ? dataItem.path : dataItem.path.substr(0, dataItem.path.lastIndexOf('/'));
       if (!path) {
       path = './';
       }
       vm.newFile(path);
       }
       else if ($(e.item).hasClass("bbn-tree-rename")) {
       vm.rename(dataItem);
       }
       else if ($(e.item).hasClass("bbn-tree-duplicate")) {
       vm.duplicate(dataItem);
       }
       else if ($(e.item).hasClass("bbn-tree-export")) {
       vm.export(dataItem);
       }
       else if ($(e.item).hasClass("bbn-tree-delete")) {
       vm.delete(dataItem, treeDS);
       }
       }
       });
       */

      // Set the theme
      vm.setTheme();

      // Set the font
      vm.setFont();

      // tabNav initialization
      //vm.mkTabNav($(vm.$refs.tabstrip), vm.root + 'editor/', 'IDE - ');

      // Function triggered when closing tabs: confirm if unsaved
      /*$(vm.$refs.tabstrip).tabNav("set", "close", function(){
       var conf = false;
       $(".ui-codemirror").each(function(){
       if ( $(this).codemirror("isChanged") ){
       conf = 1;
       }
       });
       if ( conf ){
       return confirm($.ui.codemirror.confirmation);
       }
       return 1;
       }, vm.root + 'editor');*/
    }
  };
})();