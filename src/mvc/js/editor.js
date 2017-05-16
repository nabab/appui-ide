(function(){
  return {
    beforeMount: function(){
      bbn.vue.setComponentRule(this.source.root + 'components/', 'bbn');
      bbn.vue.addComponent('editor/child_permissions');
      bbn.vue.addComponent('editor/history');
      bbn.vue.addComponent('editor/new');
      bbn.vue.addComponent('editor/permissions');
      bbn.vue.addComponent('editor/rename');
    },
    props: ['source'],
    data: function(){
      var vm = this;
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
                select: "bbn.ide.newFile();"
              }, {
                text: '<i class="fa fa-folder"></i>Directory',
                select: "bbn.ide.newDir();"
              }]
            }, {
              text: '<i class="fa fa-save"></i>Save',
              select: "bbn.ide.save();"
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
      ddrep: function(){
        var r = [];
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
      tplrep: function(e){
        bbn.fn.log("tplredp", e);
        if ( e.value && this.repositories[e.value] ){
          var cfg = this.repositories[e.value];
          return '<div style="clear: none; background-color: ' + cfg.bcolor +'; color: ' + cfg.fcolor + '" class="bbn-100">' + e.text + '</div>';
        }
      },
      /** ###### REPOSITORY ###### */

      /**
       * Gets the bbn_path property from the current repository
       *
       * @returns string|boolean
       */
      getBbnPath: function(){
        var vm = this;
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
      getRepPath: function(){
        var vm = this;
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
       * @param string tab The tab's url
       * @param string rep The repository's name
       * @returns string|boolean
       */
      getTabPath: function(tab, rep){
        var vm = this;
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
       * @param tab The tab's url
       * @returns array|boolean
       */
      getExt: function(rep, tab){
        var vm = this;
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
       * @param string ext The extension
       * @param string tab The MVC tab's name (if the file's a MVC)
       * @returns {*}
       */
      getDefaultText: function(ext, tab){
        var vm = this;
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
      isMVC: function(){
        var vm = this;
        return (vm.repositories[vm.currentRep] !== undefined ) && (vm.repositories[vm.currentRep].tabs !== undefined);
      },

      /**
       * Makes a data object necessary on file actions
       *
       * @param string rep The repository's name
       * @param string tab The tab's name (MVC)
       * @returns {*}
       */
      makeActionData: function(rep, tab){
        var vm = this;
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
       * @param object n The tree node
       * @param bool onlyDirs Set true if you want to get only folders
       * @param string tab The tab's name (MVC)
       * @returns {*}
       */
      treeLoad: function(e, n, onlyDirs, tab){
        var vm = this;
        return bbn.fn.post(vm.root + "tree/", {
          repository: vm.currentRep,
          repository_cfg: vm.repositories[vm.currentRep],
          is_mvc: vm.isMVC(),
          filter: vm.searchFile,
          path: n.node.data.path || '',
          onlydirs: onlyDirs || false,
          tab: tab || false
        }).promise().then(function(pd){
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
      filterTree: function(dataSource, query, field){
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
      treeRenderNode: function(e, d){
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
      treeNodeActivate: function(id, d, n){
        var vm = this;
        if ( !n.folder ){
          vm.addFileTab(vm.$refs.tabstrip, d);
        }
      },

      /**
       * Callback function triggered when you expand a files|folders tree node
       *
       * @param e
       * @param d
       */
      treeLazyLoad: function(e, d){
        var vm = this;
        d.result = vm.treeLoad(e, d);
      },


      /** ###### TAB ###### */

      /**
       * Makes a tabNav
       *
       * @param elem
       * @param baseURL
       * @param title
       * @param list
       * @returns {*}
       */
      mkTabNav: function (elem, baseURL, title, list){
        $(elem).tabNav({
          //current: current,
          baseTitle: title,
          baseURL: baseURL,
          autoload: true,
          list: list || []
        });
        return elem;
      },

      /**
       * Adds a file (tab) to the tabNav
       *
       * @param tabnav
       * @param file
       */
      addFileTab: function(tabnav, file){
        var vm = this,
            url = 'file/' + vm.currentRep + (file.dir || '') + file.name;
        $(tabnav).tabNav("navigate", {
          title: '<span title="' + (file.dir || '') + file.name + '">' + file.name + '</span>',
          content: '<div class="bbn-full-height"></div>',
          url: url,
          static: false,
          load: false,
          bcolor: vm.repositories[vm.currentRep].bcolor || false,
          fcolor: vm.repositories[vm.currentRep].fcolor || false,
          close: function (a, b, c) {
            return bbn.ide.close(a, b, c);
          },
          callonce: function(cont){
            vm.mkTabNav(
              $(cont).children(),
              url,
              file.name,
              vm.mkTabs(file)
            );
          }
        });
      },

      /**
       * Makes the file's tabs structure
       *
       * @param file
       * @returns {Array}
       */
      mkTabs: function(file){
        var vm = this,
            list = [];
        if ( (file !== undefined) && (file.path !== undefined) ){
          if ( vm.currentRep && vm.repositories[vm.currentRep] ){
            if ( vm.repositories[vm.currentRep].tabs ){
              // Add all MVC tabs
              $.each(vm.repositories[vm.currentRep].tabs, function(i, tab){
                if ( tab.fixed && (i === '_ctrl') ){
                  list = vm.addCTRL(list, tab, file.tab || false, file.path);
                }
                else {
                  list = vm.addTab(
                    list,
                    tab.title,
                    tab.url,
                    file.path,
                    file.tab || false,
                    tab.fcolor || false,
                    tab.bcolor || false
                  );
                }
              });
            }
            // Normal file
            else {
              list = vm.addTab(
                list,
                'Code',
                'code',
                file.path,
                'code',
                vm.repositories[vm.currentRep].fcolor|| false,
                vm.repositories[vm.currentRep].bcolor || false
              );
            }
          }
        }
        return list;
      },

      /**
       * Adds a _CTRL tab
       *
       * @param list
       * @param tab
       * @param path
       * @returns {Array.<T>|*}
       */
      addCTRL: function(list, tab, def, path){
        var vm = this;
        if ( (list !== undefined) &&
          $.isArray(list) &&
          (tab !== undefined) &&
          (tab.title !== undefined) &&
          (tab.url !== undefined) &&
          ($.type(path) === 'string') &&
          path.length
        ){
          path = path.split('/');
          path.pop();
          if ( path.length ){
            $.each(path, function(i, p){
              var pa = path.join('/') + '/',
                  ur = '';
              for ( var k = 0; k < path.length; k++ ){
                ur += '_';
              }
              ur += tab.url;
              pa += tab.fixed;
              list = vm.addTab(
                list,
                tab.title + (k === 0 ? '' : ' ' + (k+1)),
                ur,
                pa,
                def,
                tab.fcolor || false,
                tab.bcolor || false
              );
              path.pop();
            });
          }
          var pa = path.join('/');
          list = vm.addTab(
            list,
            tab.title,
            tab.url,
            (pa.length ? pa + '/' : '') + tab.fixed,
            def,
            tab.fcolor || false,
            tab.bcolor || false
          );
          return list.reverse();
        }
      },

      /**
       * Adds a tab
       *
       * @param list
       * @param title
       * @param url
       * @param path
       * @param def
       * @param fcolor
       * @param bcolor
       * @returns {*}
       */
      addTab: function(list, title, url, file, def, fcolor, bcolor){
        var vm = this;
        if ( (list !== undefined) &&
          $.isArray(list) &&
          (title !== undefined) &&
          (url !== undefined) &&
          (file !== undefined)
        ){
          list.push({
            title: title,
            content: '<div class="bbn-full-height"></div>',
            url: url,
            static: true,
            load: true,
            default: def === url,
            fcolor: fcolor || false,
            bcolor: bcolor || false,
            data: {
              repository: vm.currentRep,
              bbn_path: vm.getBbnPath(),
              rep_path: vm.getRepPath(),
              tab_path: vm.getTabPath(url),
              extensions: vm.getExt(vm.currentRep, url),
              file: {
                full_path: file
              },
              tab: url !== 'code' ? url : false
            }
          });
          return list;
        }
      },

      /**
       * Adds menu to a tab and submenus to sub
       *
       * @param o
       * @returns {string}
       */
      mkMenu: function(o){
        var st = '',
            vm = this;
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
              $.each(o.items, function (i, v) {
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
      mkCodeMirror: function(c, d){
        var vm = this,
            $cm;
        if ( d.tab && (d.tab === 'php') ){
          vm.permissionsPanel(c, d);
        }
        $cm = $("div.code", c).codemirror({
          mode: d.mode,
          value: d.value,
          selections: d.selections,
          marks: d.marks,
          save: vm.save,
          keydown: function(widget, e){
            if ( e.ctrlKey && e.shiftKey && (e.key.toLowerCase() === 't') ){
              e.preventDefault();
              vm.test();
            }
          },
          changeFromOriginal: function(wid){
            var $elem = wid.element,
                idx = $elem.closest("div[role=tabpanel]").index() - 1;
            if ( wid.changed ){
              //$elem.closest("div[data-role=tabstrip]").find("> ul > li").eq(idx).addClass("changed");
              $elem.closest("div[data-role=reorderabletabstrip]").find("> ul > li").eq(idx).addClass("changed");
              $($(vm.$refs.tabstrip).tabNav('getTab', $(vm.$refs.tabstrip).tabNav('getActiveTab'))).addClass("changed");
            }
            else {
              var ok = true;
              //$elem.closest("div[data-role=tabstrip]").find("> ul > li").eq(idx).removeClass("changed");
              $elem.closest("div[data-role=reorderabletabstrip]").find("> ul > li").eq(idx).removeClass("changed");
              //$elem.closest("div[data-role=tabstrip]").find("> ul > li").each(function(i, e){
              $elem.closest("div[data-role=reorderabletabstrip]").find("> ul > li").each(function(i, e){
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
          var $link = $("div.ui-codemirror[data-id='" + d.file.id + "']").first();
          if ( $link.length ){
            $cm.codemirror("link", $link);
          }
          $cm.attr("data-id", d.file.id);
        }
      },

      /**
       * Sets the theme to editors
       * @param string theme
       */
      setTheme: function(theme){
        $("div.code", ele).each(function () {
          $(this).codemirror("setTheme", theme ? theme : this.theme);
        });
      },

      /**
       * Sets the font to editors
       * @param string font
       * @param string font_size
       */
      setFont: function(font, font_size){
        $("div.CodeMirror", ele).css("font-family", font ? font : this.font);
        $("div.CodeMirror", ele).css("font-size", font_size ? font_size : this.font_size);
      },

      /**
       * Evaluates a code, in different ways depending on its nature
       *
       * @returns {number}
       */
      test: function(){
        var vm = this,
            $cm = $("div.k-content.k-state-active div.code:visible", $(vm.$refs.tabstrip)),
            url = $(vm.$refs.tabstrip).tabNav("getURL"),
            tabData = $($(vm.$refs.tabstrip).tabNav('getSubTabNav')).tabNav('getData'),
            rep = vm.repositories[tabData.repository] ? vm.repositories[tabData.repository] : false,
            code,
            mode;
        if ( rep && $cm.length ){
          if ( rep.tabs &&
            (tabData.file !== undefined) &&
            (tabData.file.path !== undefined) &&
            (tabData.file.name !== undefined)
          ) {
            bbn.fn.link(tabData.file.path + tabData.file.name, 1);
            return 1;
          }
          code = $cm.codemirror("getValue");
          mode = $cm.codemirror("getMode");
          if ( typeof(mode) === 'string' ){
            switch ( mode ){
              case "php":
                bbn.fn.post(data.root + "test", {code: code}, function(d){
                  var idx = $(vm.$refs.tabstrip).tabNav("getIndex", url),
                      subtab = $(vm.$refs.tabstrip).tabNav("getSubTabNav", idx),
                      list = subtab.tabNav("getList"),
                      len = list.length,
                      num = 0;
                  if ( len > 1 ){
                    while ( len ){
                      if ( list[len-1].num !== undefined ){
                        num = list[len-1].num + 1;
                        break;
                      }
                      len--;
                    }
                  }
                  subtab.tabNav("navigate", {
                    content: d.content,
                    title: moment().format('HH:mm:ss'),
                    url: 'output' + num,
                    num: num,
                    bcolor: '#58be1d',
                    fcolor: '#fdfdfd'
                  });
                });
                break;
              case "js":
                eval(code);
                break;
              case "svg":
                var oDocument = new DOMParser().parseFromString(code, "text/xml");
                if (oDocument.documentElement.nodeName == "parsererror" || !oDocument.documentElement) {
                  bbn.fn.alert("There is an XML error in this SVG");
                }
                else {
                  bbn.fn.popup($("<div/>").append(document.importNode(oDocument.documentElement, true)).html(), "Problem with SVG");
                }
                break;
              default:
                bbn.fn.alert(code, "Test: " + mode);
            }
          }
        }
      },

      /**
       * Saves the currently visible codemirror instance
       *
       * @returns {number}
       */
      save: function(){
        var vm = this,
            $cm = $("div.k-content.k-state-active div.code:visible", $(vm.$refs.tabstrip)),
            tabData = $($(vm.$refs.tabstrip).tabNav('getSubTabNav')).tabNav('getData'),
            tab_path = false,
            extensions,
            state;
        if ( $cm.length &&
          (tabData.repository !== undefined) &&
          (tabData.bbn_path !== undefined) &&
          (tabData.rep_path !== undefined) &&
          (tabData.file !== undefined) &&
          (vm.repositories[vm.currentRep] !== undefined)
        ){
          state = $cm.codemirror("getState");
          bbn.fn.post(data.root + "actions/save",
            $.extend({}, vm.makeActionData(tabData.repository, tabData.tab !== 'code' ? tabData.tab : false), {
              file: tabData.file,
              selections: state.selections,
              marks: state.marks,
              code: state.value
            }), function(d){
              if ( d.success ){
                appui.success("File saved!");
              }
              else if ( d.deleted ){
                appui.success("File deleted!");
              }
            });
          return 1;
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
      new: function(title, isFile, path){
        var vm = this;
        bbn.fn.popup($("#ide_new_template").html(), title, 540, false, {modal: true}, function(cont){
          new Vue({
            el: $(cont).get(0),
            data: $.extend({}, vm.$data, {
              title: title,
              isFile: isFile,
              path: path || './',
              types: [],
              selectedType: false,
              selectedExt: false,
              extensions: [],
              name: ''
            }),
            methods: {
              isMVC: vm.isMVC,
              setExtensions: function(extensions){
                var vm$ = this;
                vm$.extensions = $.map(extensions, function(ex){
                  if ( ex.ext ){
                    return {text: '.' + ex.ext, value: ex.ext};
                  }
                });
                if ( vm$.extensions && vm$.extensions.length ){
                  setTimeout(function(){
                    vm$.selectedExt = vm$.extensions[0].value;
                  }, 5);
                }
              },
              selectDir: function(){
                var vm$ = this;
                bbn.fn.popup('<div class="tree bbn-h-100" />', 'Select directory', 300, 500, function(w){
                  w.addClass("bbn-ide-selectdir");
                  $("div:first", w).fancytree({
                    source: function(e, d){
                      return vm.treeLoad(e, d, true, vm$.selectedType);
                    },
                    lazyLoad: function(e, d){
                      d.result = vm.treeLoad(e, d, true, vm$.selectedType);
                    },
                    renderNode: function(e, d){
                      if ( d.node.data.bcolor ){
                        $("span.fancytree-custom-icon", d.node.span).css("color", d.node.data.bcolor);
                      }
                    },
                    activate: function(e, d){
                      vm$.path = d.node.data.path + '/';
                      vm$.close();
                    }
                  });
                });

              },
              setRoot: function(){
                this.path = './'
              },
              close: function(){
                bbn.fn.closePopup();
              },
              response: function(d){
                var vm$ = this;
              }
            },
            watch: {
              selectedType: function(t, o){
                var vm$ = this;
                if ( vm$.isFile && (t !== o) ){
                  vm$.extensions = [];
                  if ( vm.repositories[vm.currentRep].tabs[t] && vm.repositories[vm.currentRep].tabs[t].extensions ){
                    vm$.setExtensions(vm.repositories[vm.currentRep].tabs[t].extensions);
                  }
                }
              }
            },
            mounted: function(){
              var vm$ = this,
                  def,
                  tabs = [];
              if ( vm.currentRep && vm.repositories && vm.repositories[vm.currentRep] ){
                bbn.fn.analyzeContent(vm$.$el);
                bbn.fn.redraw(vm$.$el, true);
                if ( vm.isMVC() ){
                  tabs = $.map(vm.repositories[vm.currentRep].tabs, function(t){
                    if ( t.fixed === undefined ){
                      if ( t.default && ( t.url !== vm$.selectedType) ){
                        def = t.url;
                      }
                      return {text: t.title, value: t.url};
                    }
                  });
                  vm$.types = tabs;
                  setTimeout(function(){
                    vm$.selectedType = def || false;
                  }, 5);
                }
                else if ( vm.repositories[vm.currentRep].extensions ){
                  vm$.setExtensions(vm.repositories[vm.currentRep].extensions);
                }
                $(vm$.$refs.new_form.$el).on('submit', function(e){
                  e.preventDefault();
                  e.stopImmediatePropagation();
                  if ( vm.currentRep &&
                    vm.repositories &&
                    vm.repositories[vm.currentRep] &&
                    vm.repositories[vm.currentRep].bbn_path &&
                    vm.repositories[vm.currentRep].path &&
                    vm$.name &&
                    vm$.path
                  ){
                    bbn.fn.post(vm.root + 'actions/create',
                      $.extend({}, vm.makeActionData(vm.currentRep, vm$.selectedType), {
                        extension: vm$.selectedExt,
                        name: vm$.name,
                        path: vm$.path,
                        default_text: vm.getDefaultText(vm$.selectedExt, vm$.selectedType),
                        is_file: vm$.isFile
                      }), function(d){
                        if ( d.success ){
                          vm$.close();
                        }
                      });
                  }
                });
              }
            }
          });
        });
      },

      /**
       * Opens a dialog for create a new file
       *
       * @param string path The current path
       */
      newFile: function(path){
        this.new('New File', true, path);
      },

      /**
       * Opens a dialog for create a new directory
       *
       * @param string path The current path
       */
      newDir: function(path){
        this.new('New Directory', false, path);
      },


      /** ###### PERMISSIONS ###### */

      permissionsPanel: function(c, d){
        var vm = this,
            $panel = $(c),
            html = $panel.html(),
            obj = kendo.observable({
              id: d.permissions && d.permissions.id ? d.permissions.id : '',
              code: d.permissions && d.permissions.code ? d.permissions.code : '',
              text: d.permissions && d.permissions.text ? d.permissions.text : '',
              help: d.permissions && d.permissions.help ? d.permissions.help : '',
              children: d.permissions && d.permissions.children ? d.permissions.children : [],
              add: function(e){
                vm.addPermission(e.target);
              },
              save: function(e){
                vm.savePermission(e.target)
              },
              checkEnter: function(e){
                if ( e.key.toLowerCase() === 'enter' ){
                  e.preventDefault();
                  $(e.target).nextAll("button:first").click();
                }
              },
              saveChild: function(e){
                vm.saveChiPermission(e.target);
              },
              removeChild: function(e){
                vm.removeChiPermission(e.target);
              }
            });

        bbn.fn.insertContent(
          '<div class="bbn-full-height perms-splitter">' +
          '<div>' + html + '</div>' +
          '<div class="perm_set"> </div>' +
          '</div>',
          $panel
        );
        var permsSplitter = $("div.perms-splitter", $panel).kendoSplitter({
          orientation: "vertical",
          panes: [{
            collapsible: false,
            size: "70%",
            resizable: false,
            scrollable: false
          }, {
            collapsible: true,
            size: "30%",
            resizable: false
          }],
          /*resize: function(){
           bbn.ide.resize(panel);
           }*/
        });
        var elem = permsSplitter.children("div.perm_set");
        bbn.fn.insertContent($("#ide_permissions_form_template").html(), elem);
        kendo.bind(elem, obj);
        //$panel.resize();
      },

      savePermission: function(bt){
        var $bt = $(bt),
            $cont = $bt.closest("div"),
            ele = $cont.find("input"),
            code = $(ele[0]).val(),
            text = $(ele[1]).val(),
            $id = $("input:hidden", $cont.closest("div.perm_set")),
            help = $("textarea", $cont).val();

        if ( code.length && text.length ){
          bbn.fn.post(data.root + 'permissions/save', {
            id: $id.val(),
            code: code,
            text: text,
            help: help
          }, function(d){
            if ( d.data && d.data.success ){
              // Notify
              $bt.after('<i class="fa fa-thumbs-up" style="margin-left: 5px; color: green"></i>');
            }
            else {
              // Notify
              $bt.after('<i class="fa fa-thumbs-down" style="margin-left: 5px; color: red"></i>');
            }
            // Remove notify
            setTimeout(function(){
              $("i.fa-thumbs-up, i.fa-thumbs-down", $cont).remove();
            }, 3000);
          });
        }
      },

      saveChiPermission: function(bt){
        var $cont = $(bt).closest("div"),
            ele = $cont.find("input"),
            code = $(ele[0]).val(),
            text = $(ele[1]).val(),
            $id = $("input:hidden", $cont.closest("div.perm_set"));

        if ( code.length && text.length ){
          bbn.fn.post(data.root + 'permissions/save', {
            id: $id.val(),
            code: code,
            text: text
          }, function(d){
            if ( d.data && d.data.success ){
              // Notify
              $cont.append('<i class="fa fa-thumbs-up" style="margin-left: 5px; color: green"></i>');
            }
            else {
              // Notify
              $cont.append('<i class="fa fa-thumbs-down" style="margin-left: 5px; color: red"></i>');
            }
            // Remove notify
            setTimeout(function(){
              $("i.fa-thumbs-up, i.fa-thumbs-down", $cont).remove();
            }, 3000);
          });
        }
      },

      addPermission: function(bt){
        var vm = this,
            $bt = $(bt),
            $cont = $bt.closest("div"),
            ele = $cont.find('input'),
            code = $(ele[0]).val(),
            text = $(ele[1]).val(),
            ul = $bt.parent().next(),
            $id = $("input:hidden", $cont.closest("div.perm_set"));

        if ( code.length && text.length ){
          bbn.fn.post(data.root + 'permissions/add', {
            id: $id.val(),
            code: code,
            text: text
          }, function(d){
            if ( d.data && d.data.success ){
              // Notify
              $cont.append('<i class="fa fa-thumbs-up" style="margin-left: 5px; color: green"></i>');
              // Insert the new item to list
              ul.append(
                '<div style="margin-bottom: 5px">' +
                '<label>Code</label>' +
                '<input class="k-textbox" readonly style="margin: 0 10px" value="' + code + '"  maxlength="255">' +
                '<label>Title/Description</label>' +
                '<input class="k-textbox" maxlength="255" style="width:400px; margin: 0 10px" value="' + text + '">' +
                '<button class="k-button" onclick="vm.saveChiPermission(this)" style="margin-right: 5px"><i class="fa fa-save"></i></button>' +
                '<button class="k-button" onclick="vm.ide.removeChiPermission(this)"><i class="fa' +
                ' fa-trash"></i></button>' +
                '</div>'
              );
              // Clear inserted fields
              $(ele[0]).val('');
              $(ele[1]).val('');
            }
            else {
              // Notify
              $cont.append('<i class="fa fa-thumbs-down" style="margin-left: 5px; color: red"></i>');
            }
            // Remove notify
            setTimeout(function(){
              $("i.fa-thumbs-up, i.fa-thumbs-down", $cont).remove();
            }, 3000);
          });
        }
      },

      removeChiPermission: function(bt){
        var $bt = $(bt),
            $cont = $bt.closest("div"),
            ele = $cont.find('input'),
            code = $(ele[0]).val(),
            $id = $("input:hidden", $cont.closest("div.perm_set"));

        bbn.fn.confirm('Are you sure to remove this item?', function(){
          bbn.fn.post(data.root + 'permissions/delete', {
            code: code,
            id: $id.val()
          }, function(d){
            if ( d.data && d.data.success ){
              $bt.closest("div").remove();
            }
          });
        });
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

      var vm = this;

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