if (appui.ide === undefined) {

  appui.ide = {

    url: data.root + 'editor',
    title: 'IDE - ',
    selected: 0,
    resize: function (ele) {
      appui.ide.tabstrip.tabNav("resize");
      $(ele).redraw();
      $("div.code:visible", ele).find(".CodeMirror:first").parent().codemirror("refresh");
    },

    setDir: function(dir){
      $("input.ide-dir_select", appui.ide.editor).data("kendoDropDownList").select(function (dataItem) {
        return dataItem.value === dir;
      });
    },

    currentSrc: function(){
      return $("input.ide-dir_select", appui.ide.editor).data("kendoDropDownList").value();
    },

    currentTab: function(){

    },

    close: function (ele, cfg, idx) {
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
          appui.fn.post(data.root + "actions/close", {
            dir: dir,
            url: tabUrl,
            editors: editors
          }, function(){
            $('div.tree', appui.ide.editor).data('kendoTreeView').select(false);
          });
          return true;
        }
      }
      return false;
    },

    dirDropDownSource: function(dirs, value){
      var r = [],
        $sel = $("input.ide-dir_select", appui.ide.editor).data("kendoDropDownList");
      if ( (dirs.toJSON !== undefined) && $.isFunction(dirs.toJSON) ){
        dirs = dirs.toJSON();
      }
      $.each(dirs, function (i, a) {
        a.value = i;
        r.push(a);
      });
      $sel.setDataSource({
        data: appui.fn.order(r, 'text', 'asc')
      });
      if (!value) {
        appui.fn.log("NO VAL");
      }
      $sel.select(function (dataItem) {
        return dataItem.value === value;
      });
    },

    test: function(){
      var $c = $("div.k-content.k-state-active div.code:visible", appui.ide.tabstrip),
          url = appui.ide.tabstrip.tabNav("getURL"),
          path = appui.ide.tabstrip.tabNav("getObs").title,
          src = url.substr(0, url.indexOf(path)),
          dir = data.dirs[src] !== undefined ? data.dirs[src] : false;
      if ( dir && $c.length ){
        if ( dir.tabs ) {
          appui.fn.log(path, dir);
          appui.fn.link(( dir.route !== undefined ? dir.route + '/' : '' ) + path, 1);
          return 1;
        }
        var c = $c.codemirror("getValue"),
            m = $c.codemirror("getMode");
        if ( typeof(m) === 'string' ){
          switch ( m ){
            case "php":
              appui.fn.window(data.root + "test", {code: c}, "90%", "90%");
              break;
            case "js":
              eval(c);
              break;
            case "svg":
              var oDocument = new DOMParser().parseFromString(c, "text/xml");
              if (oDocument.documentElement.nodeName == "parsererror" || !oDocument.documentElement) {
                alert("There is an XML error in this SVG");
              }
              else {
                appui.fn.alert($("<div/>").append(document.importNode(oDocument.documentElement, true)).html(), "Problem with SVG");
              }
              break;
            default:
              appui.fn.alert(c, "Test: " + m);
          }
        }
      }
      appui.fn.log("SRC: " + src + " PATH: " + path + " URL: " + url);
    },

    view: function (d) {
      var mode = appui.ide.currentSrc();
      var m;
      if (d.code && d.file) {
        if (d.ext === 'js') {
          m = 'js';
        }
        else if (d.ext === 'php') {
          m = 'php';
        }
        else if (d.ext === 'css') {
          m = 'css';
        }
        else if (d.ext === 'less') {
          m = 'css';
        }
        else if (d.ext === 'html') {
          m = 'html';
        }
        else if (d.ext === 'sql' || d.ext === 'mysql') {
          m = 'mysql';
        }
        else {
          m = 'text/html';
        }
        $("div.k-content.k-state-active div.code:visible", appui.ide.tabstrip).codemirror({
          value: d.code,
          mode: m
        }).scrollTop(0);
      }
      else if (d.st) {
        $("div.k-content.k-state-active div.code:visible", appui.ide.tabstrip).html(d.st).scrollTop(0);
      }
    },

    selectDir: function (input) {
      var $tree,
          dir = appui.ide.currentSrc(),
          treeDS = new kendo.data.HierarchicalDataSource({
            filterable: true,
            transport: {
              read: {
                dataType: "json",
                type: "POST",
                url: data.root + "tree",
                data: {
                  mode: dir,
                  onlydir: true
                }
              }
            },
            schema: {
              data: "data",
              model: {
                id: "path",
                hasChildren: "is_parent",
                fields: {
                  type: {type: "string"},
                  name: {type: "string"},
                  path: {type: "string"},
                  has_index: {type: "bool"},
                  is_parent: {type: "bool"}
                }
              }
            }
          });

      appui.fn.alert('<div class="tree"></div>', 'Choose directory', 250, 500, function (ele) {
        $tree = $("div.tree", ele);
        $tree.kendoTreeView({
          dataTextField: "name",
          dataSource: treeDS,
          select: function (e) {
            var r = this.dataItem(e.node);
            $(".appui-logger:visible input[name=path]").val(r.path);
            $(".appui-logger:visible input[name=uid]").val(r.uid);
            appui.fn.closeAlert();
          },
          template: function (e) {
            if (e.item.icon && e.item.type === 'dir') {
              return '<span class="k-sprite ' + e.item.icon + '"></span>' + e.item.name;
            }
          }
        });
      });
    },

    load: function(path, dir, tab){
      appui.fn.post(data.root + 'load', {
        dir: dir,
        file: path,
        tab: tab
      }, function (d) {
        if (d.data) {
          if (appui.ide.tabstrip.tabNav("search", d.data.url) === -1) {
            appui.ide.add(d.data);
          }
          appui.ide.tabstrip.tabNav("activate", data.root + 'editor/' + d.data.url + (d.data.def ? '/' + d.data.def : ''));
          //$tree.data("kendoTreeView").select(e.node);
          // Set theme
          if (data.theme) {
            $("div.code", appui.ide.editor).each(function () {
              $(this).codemirror("setTheme", data.theme);
            });
          }
          // Set font
          if (data.font) {
            $("div.CodeMirror", appui.ide.editor).css("font-family", data.font);
          }
          // Set font size
          if (data.font_size) {
            $("div.CodeMirror", appui.ide.editor).css("font-size", data.font_size);
          }
        }
      });
    },

    duplicate: function(dataItem){
      var selectedValue = appui.ide.currentSrc(),
          cfg = data.dirs[selectedValue];
      if ( cfg ) {
        appui.fn.alert($("#ide_new_template").html(), 'Duplicate', 550, false, function(ele){
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
          if (cfg.tabs !== undefined){
            // Add checkbox to update the permissions
            $('div.appui-form-label:visible:last').before(
              '<div class="appui-form-label">Update permissions</div>' +
              '<div class="appui-form-field">' +
                '<input type="checkbox" id="cb_upd_perms" class="k-checkbox" value="1">' +
                '<label class="k-checkbox-label" for="cb_upd_perms"></label>' +
              '</div>'
            );
          }
          $("form", ele).keydown(function(e){
            if ( e.key === 'Enter' ){
              e.preventDefault();
              $(this).trigger("submit");
            }
          }).attr("action", data.root + "actions/copy").data("script", function(d){
            if ( d.data.success ){
              var tree = $('div.tree', appui.ide.editor).data('kendoTreeView'),
                  upd_perms = $("#cb_upd_perms:checked").val();
              // Close popup
              appui.fn.closeAlert();
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
              
              
              /*
              if ( uid ){
                var item = tree.findByUid(uid),
                    dataItem = tree.dataItem(item),
                    dataParent = dataItem.parentNode();
                if (dataParent === undefined) {
                    dataItem.loaded(false);
                    tree.one("dataBound", function (e) {
                    e.sender.expandPath([dataItem.path]);
                  });
                  tree.dataSource.read();
                }
                else {
                  dataItem.loaded(false);
                  dataParent.loaded(false);
                  tree.one("dataBound", function (e) {
                    e.sender.expandPath([dataParent.path, dataItem.path]);
                  });
                  dataParent.load();
                }
              }
              else {
                tree.dataSource.read();
              }
               */
              if ( upd_perms ){
                appui.ide.update_permissions();
              }
            }
          });
        });
      }
    },

    delete: function(dataItem, treeDS){
      var msg;
      if ( dataItem.icon === 'folder' ){
        msg = "Are you sure that you want to delete the folder " + dataItem.path + " and all its content?";
      }
      else {
        msg = "Are you sure that you want to delete the file " + dataItem.path + "?";
      }
      if ( confirm(msg) ){
        appui.fn.post(data.root + "actions/delete", {
          path: dataItem.path,
          type: dataItem.type,
          name: dataItem.name,
          dir: appui.ide.currentSrc()
        }, function(d){
          if ( d.data && d.data.files ){
            $.each(d.data.files, function(i, v){
              var idx = appui.ide.tabstrip.tabNav("search", v);
              if (idx !== -1) {
                appui.ide.tabstrip.tabNav("close", idx);
              }
            });
            treeDS.remove(dataItem);
          }
        });
      }
    },

    rename: function(dataItem){
      var src = appui.ide.currentSrc();
      appui.fn.alert($("#ide_rename_template").html(), 'Rename element', 450, false, function(ele){
        var obs = {
          name: dataItem.name,
          dir: src,
          path: dataItem.path ? dataItem.path : './',
          type: dataItem.type
        };
        if ( data.dirs[src]['tabs'] !== undefined ) {
          // Add checkbox to update the permissions
          $('div.appui-form-label:visible:last').before(
            '<div class="appui-form-label">Update permissions</div>' +
            '<div class="appui-form-field">' +
              '<input type="checkbox" id="cb_upd_perms" class="k-checkbox" val="1" name="update_permissions" data-bind="checked: update_permissions">' +
              '<label class="k-checkbox-label" for="cb_upd_perms"></label>' +
            '</div>'
          );
          obs.update_permissions = 1;
        }
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
            var tree = $('div.tree', appui.ide.editor).data('kendoTreeView'),
                upd_perms = $("#cb_upd_perms:checked").val();
            // Close popup
            appui.fn.closeAlert();
            
            if ( dataItem.uid ){
              var dataParent = dataItem.parentNode();
              dataItem.loaded(false);
              if ( dataParent === undefined ) {
                tree.one("dataBound", function(e){
                  e.sender.expandPath([d.data.file_new]);
                });
                tree.dataSource.read().then(function(){
                  closeOpen(dataItem, d.data, tree);
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
                closeOpen(dataItem, d.data, tree);
              });
            }
            if ( upd_perms ){
              appui.ide.update_permissions();
            }
          }
        });
      });
    },

    closeOpen: function(dataItem, res, tree){
      if ( dataItem.type === 'file' ){
        var idx = appui.ide.tabstrip.tabNav("search", res.file_url);
        if ( idx !== -1 ){
          appui.ide.tabstrip.tabNav("close", idx);
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
          var idx = appui.ide.tabstrip.tabNav("search", appui.ide.getUrl(v.path, v.name));
          if ( idx !== -1 ){
            appui.ide.tabstrip.tabNav("close", idx);
          }
        });
      }
    },

    export: function (dataItem) {
      appui.fn.post_out(data.root + 'actions/export', {
        dir: appui.ide.currentSrc(),
        name: dataItem.name,
        path: dataItem.path,
        type: dataItem.type,
        act: 'export'
      }, function(d){
        appui.app.notifs.wid.show("Exported!", "success");
      });
    },

    newDir: function(path){
      var selectedValue = appui.ide.currentSrc(),
          cfg = data.dirs[selectedValue];

      if ( cfg ){
        appui.fn.alert($("#ide_new_template").html(), 'New directory', 540, false, function(ele){
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
              var formData = appui.fn.formdata($("form"), ele),
                  tree = $('div.tree', appui.ide.editor).data('kendoTreeView');

              // Close popup
              appui.fn.closeAlert();
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

    newFile: function(path){
      var selectedValue = appui.ide.currentSrc(),
          cfg = data.dirs[selectedValue];

      if ( cfg ){
        appui.fn.alert($("#ide_new_template").html(), 'New File', 540, false, function(ele){
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
              },
              showCode = function(d){
                var code = $("input[name=code]", ele);
                // Remove code input
                appui.fn.log('code', code, 'code length', code.length, 'd', d);
                if ( code.length ){
                  var cont = $(code).closest("div.appui-form-field");
                  cont.prev().remove();
                  cont.remove();
                }
                // Add code input
                if ( d.url === 'php' ){
                  $('div.appui-form-label:visible:last', ele).before(
                    '<div class="appui-form-label">Permission code</div>' +
                    '<div class="appui-form-field">' +
                      '<input type="text" name="code" class="k-textbox" maxlength="255" required>' +
                    '</div>'
                  );
                  ele.redraw();
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
                // Show or not the code input
                showCode(cfg.tabs[c.sender.value()]);
              }
            }).data("kendoDropDownList").trigger('change');
          }
          else {
            // Show or not the extensions select
            showExt(cfg);
            // Show or not the code input
            showCode(cfg);
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
              var formData = appui.fn.formdata($("form"), ele),
                  tree = $('div.tree', appui.ide.editor).data('kendoTreeView');

              // Close popup
              appui.fn.closeAlert();
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

    save: function(){
      var $c = $("div.code:visible", appui.ide.tabstrip);
      if ( $c.length ){
        var state = $c.codemirror("getState");
        appui.fn.post(data.root + "actions/save", {
          selections: state.selections,
          marks: state.marks,
          file: appui.env.path.substr(appui.ide.url.length + 1),
          act: 'save',
          code: state.value
        }, function(d){
          if ( d.success ){
            appui.app.notifs.wid.show("File saved!", "success");
          }
        });
        return 1;
      }
    },

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
            '<div class="appui-full-height"></div>' :
            '<div class="code appui-full-height"></div>',
          close: function (a, b, c) {
            return appui.ide.close(a, b, c);
          }
        };
        if ( a.static &&
          (a.file !== undefined) &&
          (a.url === 'html') &&
          (a.menu === undefined)
        ){
          var ext = a.file.substring(a.file.lastIndexOf('.')+1, a.file.length);
          b.menu = [{
            text: 'Switch to ' + (ext.toLowerCase() === 'php' ? 'HTML' : 'PHP'),
            fn: function(i, obj){
              var ext = obj.file.substring(obj.file.lastIndexOf('.')+1, obj.file.length),
                  new_ext = (ext.toLowerCase() === 'php' ? 'html' : 'php');
              b.menu[0].text = 'Switch to ' + ext.toUpperCase();
              appui.ide.switch(new_ext, obj.file);
            }
          }];
        }
        if (a.cfg !== undefined) {
          b.callback = function (ele) {
            $(ele).find("div.ui-codemirror").codemirror("refresh");
          };
        }
        return b;
      }
    },

    arrange: function (panel, a, url, title) {
      if (a.cfg !== undefined) {
        // Add users' permissions to controller tab
        if ( a.url === 'php' ){
          appui.fn.log('arrange',a);
          var $panel = $(panel),
              html = $panel.html();
          $panel.html(
            '<div class="appui-full-height perms-splitter">' +
              '<div>' + html + '</div>' +
              '<div>' +
                '<div class="k-block" style="height: 100%">' +
                  '<div class="k-header appui-c">Permissions setting</div>' +
                  '<div style="padding: 10px">' +
                    '<div>' +
                      '<label>Code</label>' +
                      '<input class="k-textbox" readonly style="margin: 0 10px" value="' + a.perm_code + '">' +
                      '<label>Title/Description</label>' +
                      '<input class="k-textbox" maxlength="255" style="width:400px; margin: 0 10px">' +
                      '<button class="k-button" onclick="appui.ide.savePermission(this)"><i class="fa fa-save"></i></button>' +
                    '</div>' +
                    '<div class="k-block" style="margin-top: 10px">' +
                      '<div class="k-header appui-c">Children permissions</div>' +
                      '<div style="padding: 10px">' +
                          '<div>' +
                            '<label>Code</label>' +
                            '<input class="k-textbox" style="margin: 0 10px" maxlength="255">' +
                            '<label>Title/Description</label>' +
                            '<input class="k-textbox" maxlength="255" style="width:400px; margin: 0 10px">' +
                            '<button class="k-button" onclick="appui.ide.addPermission(this)"><i class="fa fa-plus"></i></button>' +
                          '</div>' +
                          '<ul style="list-style: none; padding: 0">' +
                          '<li>' +

                          '</li>' +
                        '</ul>' +
                      '</div>' +
                    '</div>' +
                  '</div>' +
                '</div>' +
              '</div>' +
            '</div>'
          );
          $("div.perms-splitter", $panel).kendoSplitter({
            orientation: "vertical",
            panes: [{
              collapsible: false,
              size: "70%",
              resizable: false
            }, {
              collapsible: true,
              size: "30%",
              resizable: false
            }],
            collapse: function(){
              $panel.resize();
            },
            expand: function(){
              $panel.resize();
            }
          });
          setTimeout(function(){
            $panel.resize();
          }, 300);
        }
        $(panel).parents("div.k-content[role=tabpanel]").css("overflow", "hidden");
        $("div.code", panel).each(function () {
          var $$ = $(this);
          if (!$$.children("div.CodeMirror").length) {
            $$.codemirror($.extend(a.cfg, {
              save: appui.ide.save,
              keydown: function (widget, e) {
                if (e.ctrlKey && e.shiftKey && (e.key.toLowerCase() === 't')) {
                  e.preventDefault();
                  appui.ide.test();
                }
              },
              changeFromOriginal: function (wid) {
                var ele = wid.element,
                    idx = ele.closest("div[role=tabpanel]").index() - 1;
                if ( wid.changed ){
                  ele.closest("div[data-role=tabstrip]").find("> ul > li").eq(idx).addClass("changed");
                  $(appui.ide.tabstrip.tabNav('getTab', appui.ide.tabstrip.tabNav('getActiveTab'))).addClass("changed");
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
                    $(appui.ide.tabstrip.tabNav('getTab', appui.ide.tabstrip.tabNav('getActiveTab'))).removeClass("changed");
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
        appui.ide.build(a.list, $("div:first", panel), (url.indexOf("/" + a.url) > 0) ? url : url + '/' + a.url, title + a.title + ' - ');
      }
    },

    build: function (list, ele, url, title) {
      var current = '',
          baseURL = url + '/';
      if ( appui.env.url.indexOf(baseURL) !== -1 ){
        current = appui.env.url.split(baseURL)[1] || '';
      }
      //appui.fn.log("CURRENT", current, list);
      ele.tabNav({
        current: current,
        baseTitle: title,
        list: $.map(list, function (a) {
          return appui.ide.tabObj(a);
        })
      });
      $.each(list, function (i, a) {
        appui.ide.arrange(ele.tabNav("getContainer", i), a, url + '/' + a.url, title + a.title);
      });
    },

    add: function (obj, ele, url, title) {
      if (!ele) {
        ele = appui.ide.tabstrip;
      }
      if (!url) {
        url = appui.ide.url;
        title = appui.ide.title;
      }
      ele.tabNav("add", appui.ide.tabObj(obj));
      appui.ide.arrange(ele.tabNav("getContainer", ele.tabNav("getLength") - 1), obj, url, title);
    },

    search: function (v) {
      $("div.code:visible", appui.ide.tabstrip).codemirror("search", v || '');
    },

    replaceAll: function (v) {
      $("div.code:visible", appui.ide.tabstrip).codemirror("replaceAll", v || '');
    },

    replace: function (v) {
      $("div.code:visible", appui.ide.tabstrip).codemirror("replace", v || '');
    },

    findNext: function (v) {
      $("div.code:visible", appui.ide.tabstrip).codemirror("findNext", v || '');
    },

    findPrev: function (v) {
      $("div.code:visible", appui.ide.tabstrip).codemirror("findPrev", v || '');
    },

    cfgDirs: function () {
      appui.fn.alert($('#ide_manage_directories_template', appui.ide.editor).html(), 'Manage directories', 1000, 800, function (alert) {
        var grid = $("#ide_manage_dirs_grid").kendoGrid({
          dataSource: {
            transport: {
              type: "json",
              read: function (o) {
                appui.fn.post(data.root + 'directories', function (d) {
                  if (d.data) {
                    o.success(d.data);
                  }
                });
              },
              update: function (o) {
                appui.fn.post(data.root + 'directories', o.data, function (d) {
                  if (d.data) {
                    o.success();
                  }
                  else {
                    o.error();
                  }
                });
              },
              destroy: function (o) {
                appui.fn.post(data.root + 'directories', {id: o.data.id}, function (d) {
                  if (d.data) {
                    o.success();
                  }
                  else {
                    o.error();
                  }
                });
              },
              create: function (o) {
                appui.fn.post(data.root + 'directories', o.data, function (d) {
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
              "max-height": appui.env.height - 100
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
                var not = jQuery.extend(true, {}, appui.app.notifs.wid);
                not.options.appendTo = $(".k-grid", d.container).parent();
                not.show("Save or cancel the row's setting.", "warning");
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
              appui.fn.post(data.root + 'directories', {
                id: target.id,
                name: target.name,
                root_path: target.root_path,
                fcolor: target.fcolor,
                bcolor: target.bcolor,
                files: target.files,
                position: target.position
              }, function (d) {
                if (d.data) {
                  appui.fn.post(data.root + 'directories', {
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
      appui.fn.alert($('#ide_appearance_template', appui.ide.editor).html(), 'Appearence Preferences', 800, 430, function (alert) {
        var code = $("#code", alert),
          cm = code.codemirror({"mode": "js"}),
          divCM = $("div.CodeMirror", alert),
          oldCM = $("div.CodeMirror", appui.ide.editor),
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
          var formdata = appui.fn.formdata($("form", alert));
          formdata.font_size = formdata.font_size + 'px';
          appui.fn.post(data.root + 'appearance', formdata, function (d) {
            if (d.success) {
              appui.fn.closeAlert();
              data.theme = formdata.theme;
              data.font = formdata.font;
              data.font_size = formdata.font_size;
              $("div.code", appui.ide.editor).each(function () {
                $(this).codemirror("setTheme", data.theme);
              });
              oldCM.css("font-family", data.font);
              oldCM.css("font-size", data.font_size);
            }
          });
        });
      });
    },

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
              st += appui.ide.mkMenu(v);
            });
            st += '</ul>';
          }
          st += '</li>';
        }
      }
      return st;
    },
    
    getUrl: function(path, name){
      var src = appui.ide.currentSrc(),
          url = src + '/',
          bits = path.split('/'),
          // Filename with its extension
          fn = bits.pop(),
          // File's path
          path = bits.join('/') + '/';

      return url + path + (data.dirs[src]['tabs'] !== undefined ? name : fn);

    },

    switch: function(ext, file){
      if ( (ext !== undefined ) &&
        ext.length &&
        (file !== undefined) &&
        file.length
      ){
        appui.fn.post(data.root + "actions/switch", {
          ext: ext,
          file: file
        }, function(d){
          if ( d.data ){
            appui.ide.tabstrip.tabNav("getSubTabNav", d.data.file_url).set('file', d.data.file, d.data.file_url);
          }
        });
      }
    },

    savePermission: function(bt){
      var $cont = $(bt).closest("div"),
          ele = $cont.find('input'),
          code = $(ele[0]).val(),
          title = $(ele[1]).val();

      if ( code.length && title.length ){
        if ( confirm('Are you sure to save this item?') ){
          appui.fn.post(data.root + 'permissions/save', {
            code: code,
            title: title
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
      }
    },

    addPermission: function(bt){
      var $bt = $(bt),
          $cont = $bt.closest("div"),
          ele = $cont.find('input'),
          code = $(ele[0]).val(),
          title = $(ele[1]).val(),
          ul = $bt.parent().next();

      if ( code.length && title.length ){
        appui.fn.post(data.root + 'permissions/save', {
          code: code,
          title: title
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
                '<input class="k-textbox" maxlength="255" style="width:400px; margin: 0 10px" value="' + title + '">' +
                '<button class="k-button" onclick="appui.ide.savePermission(this)" style="margin-right: 5px"><i class="fa fa-save"></i></button>' +
                '<button class="k-button" onclick="appui.ide.removePermission(this)"><i class="fa fa-trash"></i></button>' +
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

    removePermission: function(bt){
      var $bt = $(bt),
          ele = $bt.closest("div").find('input'),
          code = $(ele[0]).val();

      if ( confirm('Are you sure to remove this item?') ){
        appui.fn.post(data.root + 'permissions/delete', {code: code}, function(d){
          if ( d.data && d.data.success ){
            $bt.closest("div").remove();
          }
        });
      }
    }

  };

  $(window).resize(function () {
    setTimeout(function () {
      appui.ide.resize();
    }, 1000);
  });
}
