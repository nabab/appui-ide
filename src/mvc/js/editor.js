bbn.ide = new Vue({
  el: '.bbn-ide-container',
  data: $.extend({}, data, {
    selected: 0,
    url: data.root + 'editor',
    editor: $(ele),
    //tabstrip: $("#tabstrip_editor", $(ele)),
    searchFile: ''
  }),
  methods: {
    /** ###### REPOSITORY ###### */

    /**
     * Sets the dataSource of the sources dropdown
     *
     * @param dirs
     */
    repDropDownSource: function(repositories){
      var $$ = this,
        r = [];
      if ( !repositories ){
        repositories = $$.repositories;
      }
      if ( (repositories.toJSON !== undefined) && $.isFunction(repositories.toJSON) ){
        repositories = repositories.toJSON();
      }
      $.each(repositories, function (i, a) {
        a.value = i;
        r.push(a);
      });
      $$.repSelect.setDataSource({
        data: bbn.fn.order(r, 'text', 'asc')
      });
      /** @todo WTF * 2  (look until the end of this function!) */
      if ( !$$.currentRep ){
        bbn.fn.log("NO VAL");
      }
      $$.repSelect.select(function(dataItem){
        return dataItem.value === $$.currentRep;
      });
      $$.repSelect.trigger('change');
    },

    /**
     * Gets the bbn_path property from the current repository
     *
     * @returns string|boolean
     */
    getBbnPath: function(){
      var $$ = this;
      if ( $$.repositories[$$.currentRep] &&
        $$.repositories[$$.currentRep].bbn_path
      ){
        return $$.repositories[$$.currentRep].bbn_path;
      }
      return false;
    },

    /**
     * Gets the path property from the current repository
     *
     * @returns string|boolean
     */
    getRepPath: function(){
      var $$ = this;
      if ( $$.repositories[$$.currentRep] &&
        $$.repositories[$$.currentRep].path
      ){
        return $$.repositories[$$.currentRep].path;
      }
      return false;
    },

    /**
     * Gets the path property from the current repository's tab
     *
     * @param tab The tab's url
     * @returns string|boolean
     */
    getTabPath: function(tab){
      var $$ = this;
      if ( tab && $$.repositories[$$.currentRep] && $$.repositories[$$.currentRep].tabs ){
        // Super controller
        if ( tab.indexOf('_ctrl') > -1 ){
          tab = '_ctrl';
        }
        if ( $$.repositories[$$.currentRep].tabs[tab] && $$.repositories[$$.currentRep].tabs[tab].path ){
          return $$.repositories[$$.currentRep].tabs[tab].path;
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
    getExt: function(tab){
      var $$ = this;
      if ( $$.repositories[$$.currentRep] ){
        // MVC
        if ( tab && $$.repositories[$$.currentRep].tabs ){
          // Super controller
          if ( tab.indexOf('_ctrl') > -1 ){
            tab = '_ctrl';
          }
          if ( $$.repositories[$$.currentRep].tabs[tab] && $$.repositories[$$.currentRep].tabs[tab].extensions ){
            return $$.repositories[$$.currentRep].tabs[tab].extensions;
          }
        }
        else if ( $$.repositories[$$.currentRep].extensions ){
          return $$.repositories[$$.currentRep].extensions;
        }
      }
      return false;
    },


    /** ###### TREE ###### */

    /**
     * Loads tree data
     *
     * @param n The tree node
     * @returns {*}
     */
    treeLoad: function(n){
      var $$ = this;
      return bbn.fn.post($$.root + "tree/", {
        dir: $$.currentRep,
        filter: $$.searchFile,
        path: n.node.data.path || false
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
      var $$ = this,
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
          var anyVisibleChildren = $$.filterTree(item.children, itemVisible || query, field); // pass true if parent
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
      var $$ = this,
          url = 'file/' + $$.currentRep + (file.dir || '') + file.name;
      bbn.fn.log('url',url);
      $(tabnav).tabNav("navigate", {
        title: '<span title="' + (file.dir || '') + file.name + '">' + file.name + '</span>',
        content: '<div class="appui-full-height"></div>',
        url: url,
        static: false,
        load: false,
        bcolor: $$.repositories[$$.currentRep].bcolor || false,
        fcolor: $$.repositories[$$.currentRep].fcolor || false,
        close: function (a, b, c) {
          return bbn.ide.close(a, b, c);
        },
        callonce: function(cont){
          $$.mkTabNav(
            $(cont).children(),
            url,
            file.name,
            $$.mkTabs(file)
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
      var $$ = this,
        list = [];
      if ( (file !== undefined) && (file.path !== undefined) ){
        if ( $$.currentRep && $$.repositories[$$.currentRep] ){
          if ( $$.repositories[$$.currentRep].tabs ){
            // Add all MVC tabs
            $.each($$.repositories[$$.currentRep].tabs, function(i, tab){
              if ( tab.fixed && (i === '_ctrl') ){
                list = $$.addCTRL(list, tab, file.tab || false, file.path);
              }
              else {
                list = $$.addTab(
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
            list = $$.addTab(
              list,
              'Code',
              'code',
              file.path,
              'code',
              $$.repositories[$$.currentRep].fcolor|| false,
              $$.repositories[$$.currentRep].bcolor || false
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
      var $$ = this;
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
            list = $$.addTab(
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
        list = $$.addTab(
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
      var $$ = this;
      if ( (list !== undefined) &&
        $.isArray(list) &&
        (title !== undefined) &&
        (url !== undefined) &&
        (file !== undefined)
      ){
        list.push({
          title: title,
          content: '<div class="appui-full-height"></div>',
          url: url,
          static: true,
          load: true,
          default: def === url,
          fcolor: fcolor || false,
          bcolor: bcolor || false,
          data: {
            repository: $$.currentRep,
            bbn_path: $$.getBbnPath(),
            rep_path: $$.getRepPath(),
            tab_path: $$.getTabPath(url),
            extensions: $$.getExt(url),
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
        $$ = this;
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
              st += $$.mkMenu(v);
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
      var $$ = this,
          $cm;
      if ( d.tab && (d.tab === 'php') ){
        $$.permissionsPanel(c, d);
      }
      $cm = $("div.code", c).codemirror({
        mode: d.mode,
        value: d.value,
        selections: d.selections,
        marks: d.marks,
        save: $$.save,
        keydown: function(widget, e){
          if ( e.ctrlKey && e.shiftKey && (e.key.toLowerCase() === 't') ){
            e.preventDefault();
            $$.test();
          }
        },
        changeFromOriginal: function(wid){
          var $elem = wid.element,
            idx = $elem.closest("div[role=tabpanel]").index() - 1;
          if ( wid.changed ){
            //$elem.closest("div[data-role=tabstrip]").find("> ul > li").eq(idx).addClass("changed");
            $elem.closest("div[data-role=reorderabletabstrip]").find("> ul > li").eq(idx).addClass("changed");
            $($($$.$refs.tabstrip).tabNav('getTab', $($$.$refs.tabstrip).tabNav('getActiveTab'))).addClass("changed");
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
              $($($$.$refs.tabstrip).tabNav('getTab', $($$.$refs.tabstrip).tabNav('getActiveTab'))).removeClass("changed");
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
      var $$ = this,
          $cm = $("div.k-content.k-state-active div.code:visible", $($$.$refs.tabstrip)),
          url = $($$.$refs.tabstrip).tabNav("getURL"),
          tabData = $($($$.$refs.tabstrip).tabNav('getSubTabNav')).tabNav('getData'),
          rep = $$.repositories[tabData.repository] ? $$.repositories[tabData.repository] : false,
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
                var idx = $($$.$refs.tabstrip).tabNav("getIndex", url),
                  subtab = $($$.$refs.tabstrip).tabNav("getSubTabNav", idx),
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
      var $$ = this,
          $cm = $("div.k-content.k-state-active div.code:visible", $($$.$refs.tabstrip)),
          tabData = $($($$.$refs.tabstrip).tabNav('getSubTabNav')).tabNav('getData'),
          tab_path = false,
          extensions,
          state;
      if ( $cm.length &&
        (tabData.repository !== undefined) &&
        (tabData.bbn_path !== undefined) &&
        (tabData.rep_path !== undefined) &&
        (tabData.file !== undefined) &&
        ($$.repositories[$$.currentRep] !== undefined)
      ){
        state = $cm.codemirror("getState");
        bbn.fn.post(data.root + "actions/save", {
          repository: tabData.repository,
          bbn_path: tabData.bbn_path,
          rep_path: tabData.rep_path,
          tab_path: $$.getTabPath(tabData.tab),
          file: tabData.file,
          extensions: $$.getExt(tabData.tab),
          tab: tabData.tab !== 'code' ? tabData.tab : false,
          selections: state.selections,
          marks: state.marks,
          code: state.value
        }, function(d){
          if ( d.success ){
            appui.notification.success("File saved!");
          }
          else if ( d.deleted ){
            appui.notification.success("File deleted!");
          }
        });
        return 1;
      }
    },

    close: function(a, b, c){
      var $$ = this;
      bbn.fn.log('close', $($$.$refs.tabstrip).tabNav('getList'));
      bbn.fn.log(a,b,c);
    },


    /** ###### PERMISSIONS ###### */

    permissionsPanel: function(c, d){
      var $$ = this,
        $panel = $(c),
        html = $panel.html(),
        obj = kendo.observable({
          id: d.permissions && d.permissions.id ? d.permissions.id : '',
          code: d.permissions && d.permissions.code ? d.permissions.code : '',
          text: d.permissions && d.permissions.text ? d.permissions.text : '',
          help: d.permissions && d.permissions.help ? d.permissions.help : '',
          children: d.permissions && d.permissions.children ? d.permissions.children : [],
          add: function(e){
            $$.addPermission(e.target);
          },
          save: function(e){
            $$.savePermission(e.target)
          },
          checkEnter: function(e){
            if ( e.key.toLowerCase() === 'enter' ){
              e.preventDefault();
              $(e.target).nextAll("button:first").click();
            }
          },
          saveChild: function(e){
            $$.saveChiPermission(e.target);
          },
          removeChild: function(e){
            $$.removeChiPermission(e.target);
          }
        });

      bbn.fn.insertContent(
        '<div class="appui-full-height perms-splitter">' +
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
      var $$ = this,
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
              '<button class="k-button" onclick="$$.saveChiPermission(this)" style="margin-right: 5px"><i class="fa fa-save"></i></button>' +
              '<button class="k-button" onclick="$$.ide.removeChiPermission(this)"><i class="fa' +
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
      var obj = bbn.ide.tabstrip.tabNav("getObs"),
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
                  orig = $("div.appui-code.ui-codemirror", c).codemirror("getValue");
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
              $code.children().addClass("appui-full-height");
              $("div.appui-codeMirror-merge-pane", $code).not(".CodeMirror-merge-pane-rightmost").before(
                '<div style="border-bottom: 1px solid #ddd">' +
                '<div class="appui-c" style="width: 50%; display: inline-block"><strong>CURRENT CODE</strong></div>' +
                '<div class="appui-c" style="width: 50%; display: inline-block"><strong>BACKUP CODE</strong></div>' +
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
                    orig = $("div.appui-code.ui-codemirror", c).codemirror("getValue");
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
                $cm.children().addClass("appui-full-height");
                $("div.appui-codeMirror-merge-pane", $cm).not(".CodeMirror-merge-pane-rightmost").before(
                  '<div style="border-bottom: 1px solid #ddd">' +
                  '<div class="appui-c" style="width: 50%; display: inline-block"><strong>CURRENT CODE</strong></div>' +
                  '<div class="appui-c" style="width: 50%; display: inline-block"><strong>BACKUP CODE</strong></div>' +
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
          appui.notification.success("History cleared!");
        }
      });
    },

    historyClearAll: function(){
      bbn.fn.post(data.root + 'history/clear', {}, function(d){
        if ( d.data.success !== undefined ){
          appui.notification.success("History cleared!");
        }
      });
    },

  },
  mounted: function(){
    var $$ = this;
    // Splitter top/bottom for menu
    $("div.bbn-ide-container", ele).kendoSplitter({
      orientation: "vertical",
      panes: [
        {collapsible: false, resizable: false, size: 40},
        {collapsible: false, resizable: false, scrollable: false}
      ]
    });

    // Splitter left/right for tree
    $("div.bbn-code-container", ele).kendoSplitter({
      orientation: "horizontal",
      panes: [
        {collapsible: true, resizable: true, size: 200},
        {collapsible: true, resizable: true, scrollable: false},
        {collapsible: true, resizable: true, size: 200, collapsed: true}
      ]
    });

    // Toolbar with buttons and menu
    $("div.appui-ide", ele).kendoToolBar({
      items: [{
        template: '<input class="k-textbox ide-tree-search" type="text" placeholder="Search file">'
      }, {
        type: "separator"
      }, {
        template: '<input class="ide-rep-select" style="width: 300px">'
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
          $.each($$.menu, function (i, v) {
            st += $$.mkMenu(v);
          });
          st += '</ul>';
          return st;
        }
      }]
    });

    // Menu inside toolbar
    $("ul.menu", ele).kendoMenu({
      direction: "bottom right"
    }).find("a").on("mouseup", function(){
      $(this).closest("ul.menu").data("kendoMenu").close();
    });

    // Search field
    $("input.ide-tree-search", ele).on('keyup', function(){
      $$.searchFile = $(this).val();
      $$.filterTree(treeDS, $(this).val().toString().toLowerCase(), "name");
    });

    // TreeView
    $$.tree = $("div.tree", ele).fancytree({
      source: function(e, d){
        return $$.treeLoad(d);
      },
      lazyLoad: function(e, d){
        d.result = $$.treeLoad(d);
      },
      renderNode: function(e, d){
        if ( d.node.data.bcolor ){
          $("span.fancytree-custom-icon", d.node.span).css("color", d.node.data.bcolor);
        }
      },
      activate: function(e, d){
        if ( !d.node.folder ){
          bbn.fn.log(d.node.data);
          $$.addFileTab($$.$refs.tabstrip, d.node.data);
        }
      }
    });
    $$.treeFT = $$.tree.fancytree('getTree');

    // Repositories dropDownList
    $$.repSelect = $("input.ide-rep-select", ele).kendoDropDownList({
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
        if ( $$.currentRep !== e.sender.value() ){
          $$.currentRep = e.sender.value();
          $$.treeFT.reload();
        }
      }
    }).data("kendoDropDownList");

    // Calling source for dropdown
    $$.repDropDownSource();

    // Menu on tree's items
    $("ul.bbn-ide-context").kendoContextMenu({
      orientation: 'vertical',
      target: $$.tree,
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
            treeview = $$.tree.data("kendoTreeView"),
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
          $$.newDir(path, parent.uid || '');
        }
        else if ($(e.item).hasClass("bbn-tree-new-file")) {
          var path = dataItem.type === 'dir' ? dataItem.path : dataItem.path.substr(0, dataItem.path.lastIndexOf('/'));
          if (!path) {
            path = './';
          }
          $$.newFile(path);
        }
        else if ($(e.item).hasClass("bbn-tree-rename")) {
          $$.rename(dataItem);
        }
        else if ($(e.item).hasClass("bbn-tree-duplicate")) {
          $$.duplicate(dataItem);
        }
        else if ($(e.item).hasClass("bbn-tree-export")) {
          $$.export(dataItem);
        }
        else if ($(e.item).hasClass("bbn-tree-delete")) {
          $$.delete(dataItem, treeDS);
        }
      }
    });

    // Set the theme
    $$.setTheme();

    // Set the font
    $$.setFont();

    // tabNav initialization
    $$.mkTabNav($($$.$refs.tabstrip), $$.root + 'editor/', 'IDE - ');

    /*
    // Function triggered when closing tabs: confirm if unsaved
    appui.tabnav.ele.tabNav("set", "close", function(){
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
    }, $$.root + 'editor');
*/
  },
});
