bbn.ide = {

  url: data.root + 'editor',
  title: 'IDE - ',
  selected: 0,
  dirs: data.dirs,
  
  /**
   * Resizes the codemirror instance contained in ele
   * @param ele
   */
  resize: function(ele){
    bbn.fn.log("resize");
    /*
    bbn.ide.tabstrip.tabNav("resize");
    if ( ele ){
      $(ele).redraw().find("div.ui-codemirror:visible:first").codemirror("refresh");
    }
    */
  },
  
  /**
   * Returns the current value of the source dropdown - which is the current tree source
   *
   * @returns string
   */
  currentSrc: function(){
    return $("input.ide-dir_select", bbn.ide.editor).data("kendoDropDownList").value();
  },
  /**
   * Applies a filter to the tree and returns true if some items are shown and false otherwise
   *
   * @param dataSource the tree's dataSource
   * @param query the filter(s)
   * @param field the field on which applying filters (text by default)
   * @returns {boolean}
   */
  filterTree: function(dataSource, query, field){
    if ( !field ){
      field = "text";
    }
    var hasVisibleChildren = false;
    var data = dataSource instanceof kendo.data.HierarchicalDataSource && dataSource.data();
    for (var i = 0; i < data.length; i++) {
      var item = data[i];
      if ( item[field] ){
        var text = item[field].toLowerCase();
        var itemVisible =
              // parent already matches
              (query === true) ||
              // query is empty
              (query === "") ||
              // item text matches query
              (text.indexOf(query) >= 0);
        var anyVisibleChildren = bbn.ide.filterTree(item.children, itemVisible || query, field); // pass true if parent matches
        hasVisibleChildren = hasVisibleChildren || anyVisibleChildren || itemVisible;
        item.hidden = !itemVisible && !anyVisibleChildren;
      }
    }
    if (data) {
      // re-apply filter on children
      dataSource.filter({ field: "hidden", operator: "neq", value: true });
    }
    return hasVisibleChildren;
  },
  
  /**
   * Closes a tab from the IDE and sends a request to the server to inform
   *
   * @param ele The DOM container
   * @param cfg The tab config
   * @returns {boolean}
   */
  close: function (ele, cfg) {
    var conf = false,
        editors = [];
    $(".ui-codemirror", ele).each(function (i) {
      var $$ = $(this);
      editors.push({name: $$.attr("data-id")});
      if ($$.codemirror("isChanged") && $.isFunction($(this).codemirror("option", "save"))) {
        conf = 1;
      }
      else{
        var state = $$.codemirror("getState");
        editors[i].selections = state.selections;
        editors[i].marks = state.marks;
        editors[i].md5 = md5(state.value);
      }
    });
    if (!conf || ( conf && confirm($.ui.codemirror.confirmation) )) {
      var tabUrl = cfg.url,
          path = cfg.title,
          dir = tabUrl.substr(0, tabUrl.indexOf(path));
      if ( data.dirs[dir] ){
        bbn.fn.post(data.root + "actions/close", {
          dir: dir,
          url: tabUrl,
          editors: editors
        }, function(){
          $('div.tree', bbn.ide.editor).data('kendoTreeView').select(false);
        });
        return true;
      }
    }
    return false;
  },
  
  /**
   * Sets the dataSource of the sources dropdown
   *
   * @param dirs
   * @param value
   */
  dirDropDownSource: function(dirs, value){
    var r = [],
      $sel = $("input.ide-dir_select", bbn.ide.editor).data("kendoDropDownList");
    if ( (dirs.toJSON !== undefined) && $.isFunction(dirs.toJSON) ){
      dirs = dirs.toJSON();
    }
    $.each(dirs, function (i, a) {
      a.value = i;
      r.push(a);
    });
    $sel.setDataSource({
      data: bbn.fn.order(r, 'text', 'asc')
    });
    /** @todo WTF * 2  (look until the end of this function!) */
    if (!value) {
      bbn.fn.log("NO VAL");
    }
    $sel.select(function (dataItem) {
      return dataItem.value === value;
    });
  },
  
  /**
   * Evaluates a code, in different ways depending on its nature
   * @returns {number}
   */
  test: function(){
    var $c = $("div.k-content.k-state-active div.appui-code:visible", bbn.ide.tabstrip),
        url = bbn.ide.tabstrip.tabNav("getURL"),
        path = bbn.ide.tabstrip.tabNav("getObs").title,
        src = url.substr(0, url.indexOf(path)),
        dir = data.dirs[src] !== undefined ? data.dirs[src] : false;
    if ( dir && $c.length ){
      if ( dir.tabs ) {
        bbn.fn.link(( dir.route !== undefined ? dir.route + '/' : '' ) + path, 1);
        return 1;
      }
      var c = $c.codemirror("getValue"),
          m = $c.codemirror("getMode");
      if ( typeof(m) === 'string' ){
        switch ( m ){
          case "php":
            bbn.fn.post(data.root + "test", {code: c}, function(d){
              var idx = bbn.ide.tabstrip.tabNav("getIndex", url),
                  subtab = bbn.ide.tabstrip.tabNav("getSubTabNav", idx),
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
              idx = subtab.tabNav("getIndex", 'output' + num);
              //subtab.tabNav("setContent", d.content, idx);
            });
            //bbn.fn.window(data.root + "test", {code: c}, "90%", "90%");
            break;
          case "js":
            eval(c);
            break;
          case "svg":
            var oDocument = new DOMParser().parseFromString(c, "text/xml");
            if (oDocument.documentElement.nodeName == "parsererror" || !oDocument.documentElement) {
              bbn.fn.alert("There is an XML error in this SVG");
            }
            else {
              bbn.fn.popup($("<div/>").append(document.importNode(oDocument.documentElement, true)).html(), "Problem with SVG");
            }
            break;
          default:
            bbn.fn.alert(c, "Test: " + m);
        }
      }
    }
    bbn.fn.log("SRC: " + src + " PATH: " + path + " URL: " + url);
  },

  load: function(path, dir, tab){
    var force = false,
        hasTabs = tab !== undefined,
        dot = path.lastIndexOf('.'),
        name;
    if ( hasTabs && dot ){
      name = dir + path.substr(0, dot) + '/' + tab;
    }
    else{
      name = dir + path;
    }
    if (bbn.ide.tabstrip.tabNav("search", name) !== -1) {
      bbn.ide.tabstrip.tabNav("activate", name);
    }
    else{
      bbn.fn.post(data.root + 'load', {
        dir: dir,
        file: path,
        tab: tab
      }, function (d) {
        if ( d.data ){
          if (bbn.ide.tabstrip.tabNav("search", d.data.url) === -1) {
            bbn.ide.add(d.data);
            force = true;
          }
          //bbn.ide.tabstrip.tabNav("activate", d.data.url + (d.data.def ? '/' + d.data.def : ''), force);
          //$tree.data("kendoTreeView").select(e.node);
          // Set theme
          if (data.theme) {
            $("div.appui-code", bbn.ide.editor).each(function () {
              $(this).codemirror("setTheme", data.theme);
            });
          }
          // Set font
          if (data.font) {
            $("div.appui-codeMirror", bbn.ide.editor).css("font-family", data.font);
          }
          // Set font size
          if (data.font_size) {
            $("div.appui-codeMirror", bbn.ide.editor).css("font-size", data.font_size);
          }
        }
      });
    }
  },
  
  /**
   * Duplicates an item (file or folder) from the tree
   *
   * @param dataItem
   */
  duplicate: function(dataItem){
    var selectedValue = bbn.ide.currentSrc(),
        cfg = data.dirs[selectedValue];
    if ( cfg ) {
      bbn.fn.popup($("#ide_new_template").html(), 'Duplicate', 550, false, function(ele){
        var path = dataItem.path.split("/");
        path.pop();
        path = path.join('/');

        // Set filename
        $("input[name=name]", ele).val(dataItem.name + '_copy').focus();
        // Set source dir
        $("input[name=dir]", ele).val(selectedValue);
        // Set path
        $("input[name=path]", ele).val(path.length ? path : './');
        // Set type
        $("input[name=type]", ele).val(dataItem.type);
        // Set file
        $("input:hidden:last").after('<input type="hidden" name="file" value="' + dataItem.path + '">');
        $("form", ele).keydown(function(e){
          if ( e.key === 'Enter' ){
            e.preventDefault();
            $(this).trigger("submit");
          }
        }).attr("action", data.root + "actions/copy").data("script", function(d){
          if ( d.data.success ){
            var tree = $('div.tree', bbn.ide.editor).data('kendoTreeView');
            // Close popup
            bbn.fn.closePopup();
            // Refresh the treeview
            tree.dataSource.read().then(function(){
              if ( d.data.file !== undefined ){
                var bits = d.data.file.split('/'),
                    fn = bits.pop(),
                    fp = bits.join('/');
                if ( fp.length ){
                  var pa = [],
                    p = fp,
                    idx;
                  pa.push(p);
                  while ( (idx = p.lastIndexOf('/')) !== -1 ){
                    p = p.substring(0, idx);
                    pa.push(p);
                  }
                  tree.expandPath(pa.reverse(), function(){
                    var uid = tree.dataSource.get(d.data.file).uid,
                        n = tree.findByUid(uid);
                    tree.select(n);
                    tree.trigger("select", {node: n});
                  });
                }
                else {
                  var uid = tree.dataSource.get(fn).uid,
                      n = tree.findByUid(uid);
                  tree.select(n);
                  tree.trigger("select", {node: n});
                }
              }
            });
          }
        });
      });
    }
  },
  
  /**
   * Deletes a file or a folder
   *
   * @param dataItem
   * @param treeDS
   */
  delete: function(dataItem, treeDS){
    var msg;
    if ( dataItem.icon === 'folder' ){
      msg = "Are you sure that you want to delete the folder " + dataItem.path + " and all its content?";
    }
    else {
      msg = "Are you sure that you want to delete the file " + dataItem.path + "?";
    }
    bbn.fn.confirm(msg, function(){
      bbn.fn.post(data.root + "actions/delete", {
        path: dataItem.path,
        type: dataItem.type,
        name: dataItem.name,
        dir: bbn.ide.currentSrc()
      }, function(d){
        if ( d.data && d.data.files ){
          $.each(d.data.files, function(i, v){
            var idx = bbn.ide.tabstrip.tabNav("search", v);
            if (idx !== -1) {
              bbn.ide.tabstrip.tabNav("close", idx);
            }
          });
          treeDS.remove(dataItem);
        }
      });
    })
  },
  
  /**
   * Renames a file or folder
   *
   * @param dataItem
   */
  rename: function(dataItem){
    var src = bbn.ide.currentSrc();
    bbn.fn.popup($("#ide_rename_template").html(), 'Rename element', 450, false, function(ele){
      var obs = {
        name: dataItem.name,
        dir: src,
        path: dataItem.path ? dataItem.path : './',
        type: dataItem.type
      };
      kendo.bind(ele, obs);
      $("form", ele).attr("action", data.root + "actions/rename").data("script", function(d){
        if ( d.data &&
          ( (d.data.file_new &&
          d.data.file_url &&
          d.data.file_new_url &&
          d.data.file_new_name &&
          d.data.file_new_ext) ||
          (d.data.file_new &&
          d.data.file_new_name) )
        ){
          var tree = $('div.tree', bbn.ide.editor).data('kendoTreeView');
          // Close popup
          bbn.fn.closePopup();

          if ( dataItem.uid ){
            var dataParent = dataItem.parentNode();
            dataItem.loaded(false);
            if ( dataParent === undefined ) {
              tree.one("dataBound", function(e){
                e.sender.expandPath([d.data.file_new]);
              });
              tree.dataSource.read().then(function(){
                bbn.ide.closeOpen(dataItem, d.data, tree);
              });
            }
            else {
              dataParent.loaded(false);
              tree.one("dataBound", function (e) {
                e.sender.expandPath([dataParent.path, d.data.file_new]);
              });
              dataParent.load();
            }
          }
          else {
            tree.dataSource.read().then(function(){
              bbn.ide.closeOpen(dataItem, d.data, tree);
            });
          }
        }
      });
    });
  },
  
  /**
   * Reloads a node of the tree to refresh it
   * @param dataItem The node
   * @param res
   * @param tree
   */
  closeOpen: function(dataItem, res, tree){
    if ( dataItem.type === 'file' ){
      var idx = bbn.ide.tabstrip.tabNav("search", res.file_url);
      if ( idx !== -1 ){
        bbn.ide.tabstrip.tabNav("close", idx);
        if ( tree !== undefined ){
          var uid = tree.dataSource.get(res.file_new + (res.file_new_ext ? '.' + res.file_new_ext : '')).uid,
              n = tree.findByUid(uid);
          tree.select(n);
          tree.trigger("select", {node: n});
        }
      }
    }
    else if ( (dataItem.type === 'dir') && dataItem.hasChildren ){
      $.each(dataItem.data, function(i,v){
        var idx = bbn.ide.tabstrip.tabNav("search", bbn.ide.getUrl(v.path, v.name));
        if ( idx !== -1 ){
          bbn.ide.tabstrip.tabNav("close", idx);
        }
      });
    }
  },
  
  /**
   * Exports the whole tree of a node into a ZIP file
   *
   * @param dataItem
   */
  export: function (dataItem) {
    bbn.fn.post_out(data.root + 'actions/export', {
      dir: bbn.ide.currentSrc(),
      name: dataItem.name,
      path: dataItem.path,
      type: dataItem.type,
      act: 'export'
    }, function(d){
      appui.notification.success("Exported!");
    });
  },
  
  /**
   * Creates a new directory
   *
   * @param path
   */
  newDir: function(path){
    var selectedValue = bbn.ide.currentSrc(),
        cfg = data.dirs[selectedValue];

    if ( cfg ){
      bbn.fn.popup($("#ide_new_template").html(), 'New directory', 540, false, function(ele){
        // Set type
        $("input[name=type]", ele).val('dir');
        // Set dir
        $("input[name=dir]", ele).val(selectedValue);
        // Set path
        $("input[name=path]", ele).val(path ? path : './');
        // Check if the selected dir is a mvc
        if ( cfg.tabs !== undefined ){
          var tabs = [],
            tabDef = false;
          // Create tabs datasource
          $.map(cfg.tabs, function(t){
            if ( t.fixed === undefined ){
              tabs.push({text: t.title, value: t.url});
            }
            if( t.default ){
              tabDef = t.url;
            }
          });
          // Add a dropdownlist for tab selection
          var $select = $('<select name="tab" required="required"/>');
          $("div.appui-form-label:first").before(
            '<div class="appui-form-label mvc-ele">Type</div>',
            $('<div class="appui-form-field  mvc-ele"/>').append($select)
          );
          // Initialize the kendo dropdownlist
          $select.kendoDropDownList({
            dataSource: tabs,
            dataTextField: "text",
            dataValueField: "value",
            value: tabDef
          }).data("kendoDropDownList").trigger('change');
        }
        // Redraw form
        ele.redraw();
        // Set focus to name input
        $("input[name=name]", ele).focus();
        $("form", ele).keydown(function(e){
          if ( e.key === 'Enter' ) {
            e.preventDefault();
            $(this).trigger("submit");
          }
        }).attr("action", data.root + 'actions/create').data("script", function(d){
          if (  d.success && d.id ){
            var formData = bbn.fn.formdata($("form"), ele),
                tree = $('div.tree', bbn.ide.editor).data('kendoTreeView');

            // Close popup
            bbn.fn.closePopup();
            if ( formData.path && formData.dir ){
              // Refresh treeview
              tree.dataSource.read().then(function(){
                // If the directory isn't into root path expand tree its path
                if ( formData.path !== './' ){
                  var pa = [],
                      p = formData.path,
                      idx;
                  pa.push(p);
                  while ( (idx = p.lastIndexOf('/')) !== -1 ){
                    p = p.substring(0, idx);
                    pa.push(p);
                  }
                  tree.expandPath(pa.reverse());
                }
              });
            }
          }
        });
      });
    }
  },
  
  /**
   * Creates a new file (or group fof files)
   *
   * @param path
   */
  newFile: function(path){
    var selectedValue = bbn.ide.currentSrc(),
        cfg = data.dirs[selectedValue];

    if ( cfg ){
      bbn.fn.popup($("#ide_new_template").html(), 'New File', 540, false, function(ele){
        var showExt = function(d){
              var ext = $("select[name=ext]", ele).data("kendoDropDownList");
              // Remove ext select
              if ( ext !== undefined ){
                ext.destroy();
                ext.wrapper.remove();
              }
              // Add ext select
              if ( d.extensions.length > 1 ){
                // Crate extensions datasource
                var exts = [];
                $.map(d.extensions, function(ex){
                  exts.push({text: '.' + ex.ext, value: ex.ext});
                });
                // Insert a select to dom for extension selection
                $("input[name=name]", ele).after('<select name="ext" required></select>');
                // Initialize kendo dropdownlist for extensions
                $("select[name=ext]", ele).kendoDropDownList({
                  dataSource: exts,
                  dataTextField: "text",
                  dataValueField: "value",
                  value: exts[0]
                });
              }
            };
        // Set type (file or dir)
        $("input[name=type]:hidden", ele).val('file');
        // Set dir
        $("input[name=dir]", ele).val(selectedValue);
        // Set path
        $("input[name=path]", ele).val(path ? path : './');
        // Check if the selected dir is a mvc
        if ( cfg.tabs !== undefined ){
          var tabs = [],
              tabDef = false;
          // Create tabs datasource
          $.map(cfg.tabs, function(t){
            if ( t.fixed === undefined ){
              tabs.push({text: t.title, value: t.url});
            }
            if( t.default ){
              tabDef = t.url;
            }
          });
          // Add a dropdownlist for tab selection
          var $select = $('<select name="tab" required="required"/>');
          $("div.appui-form-label:first", ele).before(
            '<div class="appui-form-label mvc-ele">Type</div>',
            $('<div class="appui-form-field  mvc-ele"/>').append($select)
          );
          // Initialize the kendo dropdownlist
          $select.kendoDropDownList({
            dataSource: tabs,
            dataTextField: "text",
            dataValueField: "value",
            value: tabDef,
            change: function(c){
              // Show or not the extensions select
              showExt(cfg.tabs[c.sender.value()]);
            }
          }).data("kendoDropDownList").trigger('change');
        }
        else {
          // Show or not the extensions select
          showExt(cfg);
        }
        // Redraw form
        ele.redraw();
        // Set focus to name input
        $("input[name=name]", ele).focus();
        // Form script
        $("form", ele).keydown(function(e){
          if ( e.key === 'Enter' ) {
            e.preventDefault();
            $(this).trigger("submit");
          }
        }).attr("action", data.root + "actions/create").data("script", function(d){
          if ( d.success  && d.id ) {
            var formData = bbn.fn.formdata($("form"), ele),
                tree = $('div.tree', bbn.ide.editor).data('kendoTreeView');

            // Close popup
            bbn.fn.closePopup();
            if ( formData.path && formData.dir ){
              tree.dataSource.read().then(function(){
                // If the file is into root path select and open it
                if ( formData.path === './' ){
                  var uid = tree.dataSource.get(d.id).uid,
                      n = tree.findByUid(uid);
                  tree.select(n);
                  tree.trigger("select", {node: n});
                }
                // If the file isn't into the root path expand the treeview to its path and open it
                else {
                  var pa = [],
                      p = formData.path,
                      idx;
                  pa.push(p);
                  while ( (idx = p.lastIndexOf('/')) !== -1 ){
                    p = p.substring(0, idx);
                    pa.push(p);
                  }
                  tree.expandPath(pa.reverse(), function(){
                    var uid = tree.dataSource.get(d.id).uid,
                        n = tree.findByUid(uid);
                    tree.select(n);
                    tree.trigger("select", {node: n});
                  });
                }
              });
            }
          }
        });
      });
    }
  },
  
  /**
   * Saves the currently visible codemirror instance
   *
   * @returns {number}
   */
  save: function(){
    var $c = $("div.appui-code:visible", bbn.ide.tabstrip);
    if ( $c.length ){
      var state = $c.codemirror("getState");
      bbn.fn.post(data.root + "actions/save", {
        selections: state.selections,
        marks: state.marks,
        file: bbn.env.path.substr(bbn.ide.url.length + 1),
        act: 'save',
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
  
  /**
   * Returns an object formatted for using as a new tab in the main tabNav
   * @param a
   * @returns {{title: string, url: string, static: boolean, file: boolean|string, bcolor: string, fcolor: string, def: string, default: boolean, content: string, close: function, load: boolean}}
   */
  tabObj: function (a) {
    if (a.url) {
      var b = {
        title: a.title ? a.title : ' ',
        url: a.url,
        static: a.static ? true : false,
        file: a.file === undefined ? false : a.file,
        bcolor: a.bcolor,
        fcolor: a.fcolor,
        def: a.def ? a.def : '',
        default: a.default ? true : false,
        content: a.cfg === undefined ?
          '<div></div>' :
          '<div class="code appui-full-height"></div>',
        close: function (a, b, c) {
          return bbn.ide.close(a, b, c);
        },
        load: true
      };
      if ( a.static &&
        (a.url === 'html') &&
        (a.menu === undefined)
      ){
        b.title = b.title + ' ' + a.cfg.mode.toUpperCase();
        if ( a.file !== undefined ){
          b.menu = [{
            text: 'Switch to ' + (a.cfg.mode === 'php' ? 'HTML' : 'PHP'),
            fn: function(i, obj){
              var mode = $("div.ui-codemirror:visible", ele).codemirror('getMode'),
                newMode = mode.toLowerCase() === 'php' ? 'html' : 'php';
              b.menu[0].text = 'Switch to ' + mode.toUpperCase();
              if ( obj.file !== undefined ){
                bbn.ide.switchMode(newMode, obj.file);
              }
            }
          }];
        }
      }
      if (a.cfg !== undefined) {
        b.callback = function(ele){
          bbn.fn.log("refresh");
          $(ele).find("div.ui-codemirror:visible").codemirror("refresh");
          bbn.fn.log("refresh2");
          bbn.ide.resize(ele);
        };
      }
      return b;
    }
  },
  
  /**
   *
   * @param panel
   * @param a
   * @param url
   * @param title
   */
  arrange: function (panel, a, url, title) {
    if (a.cfg !== undefined) {
      // Add users' permissions to controller tab
      if ( a.url === 'php' ){
        bbn.fn.log(a, this);
        var $panel = $(panel),
            html = $panel.html(),
            obj = kendo.observable({
              perm_id: a.perm_id,
              perm_code: a.perm_code,
              perm_text: a.perm_text ? a.perm_text : '',
              perm_help: a.perm_help ? a.perm_help : '',
              perm_children: a.children ? a.children : [],
              add: function(e){
                bbn.fn.log(e);
                bbn.ide.addPermission(e.target);
              },
              save: function(e){
                bbn.fn.log(e);
                bbn.ide.savePermission(e.target)
              },
              checkEnter: function(e){
                if ( e.key.toLowerCase() === 'enter' ){
                  e.preventDefault();
                  $(e.target).nextAll("button:first").click();
                }
              },
              saveChild: function(e){
                bbn.ide.saveChiPermission(e.target);
              },
              removeChild: function(e){
                bbn.ide.removeChiPermission(e.target);
              }
            });

        var $div = $('<div/>');
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
          resize: function(){
            bbn.ide.resize(panel);
          }
        });
        var elem = permsSplitter.children("div.perm_set");
        bbn.fn.insertContent($("#ide_permissions_form_template").html(), elem);
        kendo.bind(elem, obj);
        $panel.resize();
      }
      $("div.appui-code", panel).each(function () {
        var $$ = $(this);
        if (!$$.children("div.appui-codeMirror").length) {
          $$.codemirror($.extend(a.cfg, {
            save: bbn.ide.save,
            keydown: function (widget, e) {
              if (e.ctrlKey && e.shiftKey && (e.key.toLowerCase() === 't')) {
                e.preventDefault();
                bbn.ide.test();
              }
            },
            changeFromOriginal: function (wid) {
              var ele = wid.element,
                  idx = ele.closest("div[role=tabpanel]").index() - 1;
              if ( wid.changed ){
                ele.closest("div[data-role=tabstrip]").find("> ul > li").eq(idx).addClass("changed");
                $(bbn.ide.tabstrip.tabNav('getTab', bbn.ide.tabstrip.tabNav('getActiveTab'))).addClass("changed");
              }
              else {
                var ok = true;
                ele.closest("div[data-role=tabstrip]").find("> ul > li").eq(idx).removeClass("changed");
                ele.closest("div[data-role=tabstrip]").find("> ul > li").each(function(i, e){
                    if ( $(e).hasClass("changed") ){
                      ok = false;
                    }
                });
                if ( ok ){
                  $(bbn.ide.tabstrip.tabNav('getTab', bbn.ide.tabstrip.tabNav('getActiveTab'))).removeClass("changed");
                }
              }
            }
          }));
          if ( a.id_script ) {
            var $link = $("div.ui-codemirror[data-id='" + a.id_script + "']").first();
            if ( $link.length ){
              $$.codemirror("link", $link);
            }
            $$.attr("data-id", a.id_script);
          }
        }
      });
    }
    else if (a.list) {
      bbn.ide.build(a.list, $("div:first", panel), (url.indexOf("/" + a.url) > 0) ? url : url + '/' + a.url, title + a.title + ' - ');
    }
  },

  build: function (list, ele, url, title) {
    bbn.fn.log("BUILD", url, data.root);
    var current = '';
    if ( bbn.env.url.indexOf(data.baseURL) !== -1 ){
      current = bbn.env.url.split(data.baseURL)[1] || '';
    }
    //bbn.fn.log("CURRENT", current, list);
    bbn.fn.log("build", current, url, title, data.baseURL);
    ele.tabNav({
      current: current,
      baseTitle: title,
      baseURL: data.baseURL,
      autoload: true,
      list: $.map(list, function (a) {
        return bbn.ide.tabObj(a);
      })
    });
    $.each(list, function (i, a) {
      bbn.ide.arrange(ele.tabNav("getContainer", i), a, url + '/' + a.url, title);
    });
  },

  add: function (obj, ele, url, title) {
    if (!ele) {
      ele = bbn.ide.tabstrip;
    }
    if (!url) {
      url = bbn.ide.url;
      title = bbn.ide.title;
    }
    var tn = ele.tabNav("add", bbn.ide.tabObj(obj)),
        idx = ele.tabNav("getList").length - 1,
        tab = ele.tabNav("getTab", idx),
        wid = ele.data("kendoTabStrip");
    wid.activateTab(tab);
    bbn.ide.arrange(ele.tabNav("getContainer", ele.tabNav("getLength") - 1), obj, url, title);
  },
  
  /**
   * Launches codemirror search function on current editor
   *
   * @param string value the search query
   */
  search: function (value) {
    $("div.appui-code:visible", bbn.ide.tabstrip).codemirror("search", value || '');
  },
  
  /**
   * Launches codemirror's replace all function on current editor
   *
   * @param string value the search query
   * @todo WTF? Noi replace string
   */
  replaceAll: function (v) {
    $("div.appui-code:visible", bbn.ide.tabstrip).codemirror("replaceAll", v || '');
  },
  
  /**
   * Launches codemirror's replace function on current editor
   *
   * @param v value to search
   * @todo WTF? Noi replace string
   */
  replace: function (v) {
    $("div.appui-code:visible", bbn.ide.tabstrip).codemirror("replace", v || '');
  },
  
  /**
   * Launches codemirror's replace function on current editor
   *
   * @param v value to search
   */
  findNext: function (v) {
    $("div.appui-code:visible", bbn.ide.tabstrip).codemirror("findNext", v || '');
  },
  
  /**
   * Launches codemirror's replace function on current editor
   *
   * @param v value to search
   */
  findPrev: function (v) {
    $("div.appui-code:visible", bbn.ide.tabstrip).codemirror("findPrev", v || '');
  },
  
  /**
   * Adds a menu to a tab and submenus to sub
   *
   * @param o
   * @returns {string}
   */
  mkMenu: function (o) {
    var st = '';
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
            st += bbn.ide.mkMenu(v);
          });
          st += '</ul>';
        }
        st += '</li>';
      }
    }
    return st;
  },

  getUrl: function(path, name){
    var src = bbn.ide.currentSrc(),
        url = src + '/',
        bits = path.split('/'),
        // Filename with its extension
        fn = bits.pop(),
        // File's path
        path = bits.join('/') + '/';

    return url + path + (data.dirs[src]['tabs'] !== undefined ? name : fn);

  },
  
  /**
   * Changes the mode of a codemirror instance
   *
   * @param ext
   * @param file
   */
  switchMode: function(ext, file){
    if ( (ext !== undefined ) &&
      ext.length &&
      (file !== undefined) &&
      file.length
    ){
      bbn.fn.post(data.root + "actions/switch", {
        ext: ext,
        file: file
      }, function(d){
        if ( d.data ){
          var tn = bbn.ide.tabstrip.tabNav("getSubTabNav", d.data.file_url);
          tn.tabNav('set', 'file', d.data.file, d.data.file_url);
          tn.tabNav('setTitle', 'View ' + ext.toUpperCase(), d.data.file_url);
          $("div.appui-code.ui-codemirror:visible", tn).codemirror('setMode', ext);
        }
      });
    }
  },
  
  findCfg: function(file){
    for ( var n in bbn.ide.dirs ){
      if ( file.indexOf(n) === 0 ){
        return bbn.ide.dirs[n];
      }
    }
    return false;
  },
  
  /**
   *
   * @param bt
   */
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
    var $bt = $(bt),
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
              '<button class="k-button" onclick="bbn.ide.saveChiPermission(this)" style="margin-right: 5px"><i class="fa fa-save"></i></button>' +
              '<button class="k-button" onclick="bbn.ide.removeChiPermission(this)"><i class="fa fa-trash"></i></button>' +
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

  cfgDirs: function () {
    bbn.fn.popup($('#ide_manage_directories_template', bbn.ide.editor).html(), 'Manage directories', 1000, 800, function (alert) {
      var grid = $("#ide_manage_dirs_grid").kendoGrid({
        dataSource: {
          transport: {
            type: "json",
            read: function (o) {
              bbn.fn.post(data.root + 'directories', function (d) {
                if (d.data) {
                  o.success(d.data);
                }
              });
            },
            update: function (o) {
              bbn.fn.post(data.root + 'directories', o.data, function (d) {
                if (d.data) {
                  o.success();
                }
                else {
                  o.error();
                }
              });
            },
            destroy: function (o) {
              bbn.fn.post(data.root + 'directories', {id: o.data.id}, function (d) {
                if (d.data) {
                  o.success();
                }
                else {
                  o.error();
                }
              });
            },
            create: function (o) {
              bbn.fn.post(data.root + 'directories', o.data, function (d) {
                if (d.data) {
                  o.success(d.data);
                }
                else {
                  o.error();
                }
              });
            }
          },
          sort: {
            field: 'position',
            dir: 'asc'
          },
          schema: {
            model: {
              id: "id",
              fields: {
                id: {editable: false, nullable: false},
                name: {type: 'string'},
                root_path: {type: 'string'},
                fcolor: {type: 'string'},
                bcolor: {type: 'string'},
                files: {type: 'string', defaultValue: '[]'},
                position: {type: 'number'}
              }
            }
          }
        },
        columns: [{
          title: "Name",
          field: "name",
          width: 200
        }, {
          title: "Path",
          field: "root_path"
        }, {
          title: "BG",
          field: "bcolor",
          width: 40,
          template: function (e) {
            return '<div style="border: 0.5px solid black; background-color: ' + e.bcolor + ';">&nbsp;</div>';
          }
        }, {
          title: "FC",
          field: "fcolor",
          width: 40,
          template: function (e) {
            return '<div style="border: 0.5px solid black; background-color: ' + e.fcolor + ';">&nbsp;</div>';
          }
        }, {
          title: "Title : Ext : Path",
          field: "files",
          template: function (e) {
            var f = JSON.parse(e.files),
              r = '';
            for (var i = 0; i < f.length; i++) {
              r += '<div style="padding: 2px 5px; background-color: ' + ( f[i].bcolor ? f[i].bcolor : e.bcolor ) + '; color: ' + ( f[i].fcolor ? f[i].fcolor : e.fcolor ) + '">' +
                (f[i].default ? '<i class="fa fa-star"></i> ' : '') + (f[i].title ? f[i].title + ' : ' : '') + f[i].ext + ' : ' + f[i].path + '</div>';
            }
            return r;
          }
        }, {
          title: " ",
          width: 150,
          sortable: false,
          attributes: {
            style: "text-align: center"
          },
          command: [{
            name: "edit",
            text: {
              edit: "Edit",
              cancel: "Cancel",
              update: "Save"
            }
          }, {
            name: "destroy",
            text: "Delete"
          }]
        }],
        toolbar: '<div class="toolbar"><a class="k-button k-button-icontext k-grid-add" href="javascript:;"><span class="k-icon k-add"></span>Add directory</a></div>',
        editable: "popup",
        edit: function (d) {
          var files = [];
          d.container.parent().children("div:first").children(".k-window-actions").remove();
          $(".k-edit-label", d.container).width('10%');
          $(".k-edit-field", d.container).width('85%');
          $(this.editable.element.find("input[name=root_path]")).width(510);
          if (!d.model.id) {
            $("<input/>").width(70).prependTo(this.editable.element.find("input[name=root_path]").width(430).parent()).kendoDropDownList({
              dataSource: [{
                text: "",
                value: ""
              }, {
                text: "APP",
                value: "BBN_APP_PATH/"
              }, {
                text: "CDN",
                value: "BBN_CDN_PATH/"
              }, {
                text: "DATA",
                value: "BBN_DATA_PATH/"
              }, {
                text: "LIB",
                value: "BBN_LIB_PATH/"
              }],
              dataTextField: "text",
              dataValueField: "value",
              change: function (e) {
                $(this.wrapper).next().val(e.sender.value());
                d.model.set("root_path", e.sender.value());
              }
            });
          }
          this.editable.element.find("input[name=bcolor]").kendoColorPicker(d.model.bcolor ? {value: d.model.bcolor} : {});
          this.editable.element.find("input[name=fcolor]").kendoColorPicker(d.model.fcolor ? {value: d.model.fcolor} : {});
          var subgrid = $("<div/>").kendoGrid({
            dataSource: {
              transport: {
                type: "json",
                read: function (o) {
                  files = JSON.parse(d.model.files);
                  o.success(files);
                },
                create: function (o) {
                  var id = 0;
                  if (files.length > 0) {
                    $.map(files, function (f) {
                      id = f.id > id ? f.id : id;
                    });
                  }
                  o.data.id = id + 1;
                  files.push(o.data);
                  d.model.set("files", JSON.stringify(files));
                  o.success(o.data);
                },
                update: function (o) {
                  $.map(files, function (f, i) {
                    if (f.id === o.data.id) {
                      files[i].title = o.data.title;
                      files[i].ext = o.data.ext;
                      files[i].path = o.data.path;
                      files[i].url = o.data.url;
                      files[i].mode = o.data.mode;
                      files[i].fcolor = o.data.fcolor;
                      files[i].bcolor = o.data.bcolor;
                      files[i].default = o.data.default;

                    }
                  });
                  d.model.set("files", JSON.stringify(files));
                  o.success();
                },
                destroy: function (o) {
                  var del = $.map(files, function (f, i) {
                    if (f.id === o.data.id) {
                      return i;
                    }
                  });
                  files.splice(del, 1);
                  d.model.set("files", JSON.stringify(files));
                  o.success();
                }
              },
              order: {
                field: 'id',
                dir: 'asc'
              },
              schema: {
                model: {
                  id: "id",
                  fields: {
                    id: {type: 'number', editable: true, nullable: false},
                    title: {type: 'string'},
                    ext: {type: 'string'},
                    path: {type: 'string'},
                    url: {type: 'string'},
                    mode: {type: 'string'},
                    fcolor: {type: 'string'},
                    bcolor: {type: 'string'},
                    default: {type: 'boolean'}
                  }
                }
              }
            },
            columns: [{
              title: "Title",
              field: "title",
              width: 120
            }, {
              title: "Ext",
              field: "ext",
              width: 80
            }, {
              title: "Url",
              field: "url",
              width: 70
            }, {
              title: "Mode",
              field: "mode",
              width: 70
            }, {
              title: "Path",
              field: "path"
            }, {
              title: "Def.",
              field: "default",
              width: 40,
              attributes: {
                style: "text-align: center"
              },
              template: function (e) {
                return e.default ? '<i class="fa fa-check"></i>' : '';
              }
            }, {
              title: "BG",
              field: "bcolor",
              width: 63,
              template: function (e) {
                return '<div class="bcolor" style="border: 0.5px solid black; background-color: ' + e.bcolor + ';">&nbsp;</div>';
              }
            }, {
              title: "FC",
              field: "fcolor",
              width: 63,
              template: function (e) {
                return '<div class="fcolor" style="border: 0.5px solid black; background-color: ' + e.fcolor + ';">&nbsp;</div>';
              }
            }, {
              title: " ",
              width: 90,
              sortable: false,
              attributes: {
                style: "text-align: center"
              },
              command: [{
                name: "edit",
                text: {
                  edit: "",
                  cancel: "",
                  update: ""
                }
              }, {
                name: "destroy",
                text: ""
              }]
            }],
            toolbar: '<div class="toolbar"><a class="k-button k-button-icontext k-grid-add" href="javascript:;"><span class="k-icon k-add"></span>Add</a></div>',
            editable: "inline",
            edit: function (dd) {
              this.editable.element.find("input[name=bcolor]").kendoColorPicker(dd.model.bcolor ? {value: dd.model.bcolor} : {});
              this.editable.element.find("input[name=fcolor]").kendoColorPicker(dd.model.fcolor ? {value: dd.model.fcolor} : {});
            }
          }).appendTo(this.editable.element.find("input[name=files]").hide().parent()).data("kendoGrid");
          $(".k-edit-form-container").parent().css({
            height: "auto",
            width: 1000,
            "max-height": bbn.env.height - 100
          }).restyle().data("kendoWindow").title(d.model.id ? "Edit directory" : "New directory").center();
          //Drag and drop to reorder rows
          subgrid.table.kendoDraggable({
            filter: "tbody > tr:not(.k-grid-edit-row)",
            group: "gridGroup",
            threshold: 100,
            hint: function (e) {
              return $('<div class="k-grid k-widget" style="width: 800px"><table><tbody><tr>' + e.html() + '</tr></tbody></table></div>');
            }
          });
          subgrid.table.kendoDropTarget({
            group: "gridGroup",
            drop: function (e) {
              e.draggable.hint.hide();
              var target = subgrid.dataSource.getByUid($(e.draggable.currentTarget).data("uid")),
                dest = $(document.elementFromPoint(e.clientX, e.clientY));
              if (dest.is("th")) {
                return;
              }
              dest = subgrid.dataSource.getByUid(dest.parent().data("uid"));
              //not on same item
              if (target.get("id") !== dest.get("id")) {
                //reorder the items
                var tmp = target.get('id');
                target.set('id', dest.get('id'));
                dest.set('id', tmp);
                subgrid.dataSource.sort({field: "id", dir: "asc"});
                subgrid.dataSource.sync();
              }
            }
          });
          // Checks if subgrid (files) is in edit mode and show notification if is true
          $("a.k-grid-update:last, .k-grid-add", d.container).on("click", function (ele) {
            if ($(d.container).find(".k-grid-edit-row").length) {
              ele.preventDefault();
              ele.stopPropagation();
              appui.notification.warning("Save or cancel the row's setting.");
            }
          });
        }
      }).data("kendoGrid");
      //Drag and drop to reorder rows
      grid.table.kendoDraggable({
        filter: "tbody > tr",
        group: "gridGroup",
        threshold: 100,
        hint: function (e) {
          return $('<div class="k-grid k-widget" style="width: 980px"><table><tbody><tr>' + e.html() + '</tr></tbody></table></div>');
        }
      });
      grid.table.kendoDropTarget({
        group: "gridGroup",
        drop: function (e) {
          e.draggable.hint.hide();
          var target = grid.dataSource.getByUid($(e.draggable.currentTarget).data("uid")),
            dest = $(document.elementFromPoint(e.clientX, e.clientY));
          if (dest.is("th")) {
            return;
          }
          dest = grid.dataSource.getByUid(dest.parent().data("uid"));
          //not on same item
          if (target.get("id") !== dest.get("id")) {
            //reorder the items
            var tmp = target.get("position");
            grid.dataSource.pushUpdate([
              {id: target.id, position: dest.get("position")},
              {id: dest.id, position: tmp}
            ]);
            target = grid.dataSource.getByUid(target.uid);
            dest = grid.dataSource.getByUid(dest.uid);
            bbn.fn.post(data.root + 'directories', {
              id: target.id,
              name: target.name,
              root_path: target.root_path,
              fcolor: target.fcolor,
              bcolor: target.bcolor,
              files: target.files,
              position: target.position
            }, function (d) {
              if (d.data) {
                bbn.fn.post(data.root + 'directories', {
                  id: dest.id,
                  name: dest.name,
                  root_path: dest.root_path,
                  fcolor: dest.fcolor,
                  bcolor: dest.bcolor,
                  files: dest.files,
                  position: dest.position
                });
              }
            });
            grid.dataSource.sort({field: "position", dir: "asc"});
          }
        }
      });
    });
  },

  cfgStyle: function () {
    bbn.fn.popup($('#ide_appearance_template', bbn.ide.editor).html(), 'Appearence Preferences', 800, 430, function (alert) {
      var code = $("#code", alert),
        cm = code.codemirror({"mode": "js"}),
        divCM = $("div.appui-codeMirror", alert),
        oldCM = $("div.appui-codeMirror", bbn.ide.editor),
        themes = [],
        fonts = [
          {"text": "Inconsolata", "value": "Inconsolata"},
          {"text": "Georgia", "value": "Georgia"},
          {"text": "Times New Roman", "value": "Times New Roman"},
          {"text": "Arial", "value": "Arial"},
          {"text": "Verdana", "value": "Verdana"},
          {"text": "Courier New", "value": "Courier New"},
          {"text": "Consolas", "value": "Consolas"}
        ];
      $.each($.ui.codemirror.themes, function (i, v) {
        themes.push({"text": v, "value": v});
      });
      $("#ide_theme_sel", alert).width("250px").kendoDropDownList({
        dataSource: themes,
        dataTextField: "text",
        dataValueField: "value",
        value: ( data.theme ? data.theme : cm.codemirror("getTheme") ),
        change: function (e) {
          code.codemirror("changeTheme", e.sender.value());
        }
      });
      $("#ide_font_sel", alert).width("250px").kendoDropDownList({
        dataSource: fonts,
        dataTextField: "text",
        dataValueField: "value",
        value: ( data.font ? data.font : divCM.css("font-family") ),
        change: function (e) {
          divCM.css("font-family", e.sender.value());
        }
      });
      $("#ide_font_size_sel", alert).width("70px").kendoNumericTextBox({
        min: 2,
        max: 50,
        format: "# px",
        value: ( data.font_size ? data.font_size : divCM.css("font-size") ),
        spin: function (e) {
          divCM.css("font-size", e.sender.value() + 'px');
        }
      });
      if (data.theme) {
        cm.codemirror("setTheme", data.theme);
      }
      if (data.font) {
        divCM.css("font-family", data.font);
      }
      if (data.font_size) {
        divCM.css("font-size", data.font_size);
      }
      $("i.fa-save", alert).parent().on("click", function () {
        var formdata = bbn.fn.formdata($("form", alert));
        formdata.font_size = formdata.font_size + 'px';
        bbn.fn.post(data.root + 'appearance', formdata, function (d) {
          if (d.success) {
            bbn.fn.closePopup();
            data.theme = formdata.theme;
            data.font = formdata.font;
            data.font_size = formdata.font_size;
            $("div.appui-code", bbn.ide.editor).each(function () {
              $(this).codemirror("setTheme", data.theme);
            });
            oldCM.css("font-family", data.font);
            oldCM.css("font-size", data.font_size);
          }
        });
      });
    });
  }
};