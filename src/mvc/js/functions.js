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

    currentSelection: function(){
      return $("input.ide-dir_select", appui.ide.editor).data("kendoDropDownList").value();
    },

    currentSrc: function(){
      return appui.ide.currentSelection().split('/')[0];
    },

    currentTab: function(){

    },

    close: function (ele, cfg, idx) {
      appui.fn.log(cfg);
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
        var p2,
            tabUrl = cfg.url,
            sIdx = tabUrl.indexOf("/"),
            dir = tabUrl.substr(0, sIdx),
            sIdx2 = tabUrl.indexOf('/', sIdx+1);
        if ( data.dirs[dir] ){
          if ( data.dirs[dir].tabs ){
            if ( sIdx2 > -1 ){
              sIdx++;
              var p2 = tabUrl.substr(sIdx, sIdx2 - sIdx);
              if ( data.dirs[dir].tabs[p2] ){

                dir += '/' + p2;
              }
            }
          }
          appui.fn.post(data.root + "actions/close", {
            dir: dir,
            url: tabUrl,
            file: cfg.id_script,
            editors: editors
          }, function(){
            $('div.tree', appui.ide.editor).data('kendoTreeView').select(false);
            if (!appui.ide.tabstrip.tabNav("getLength").length) {
              appui.fn.setNavigationVars(appui.ide.url, 'IDE ');
            }
          });
          return true;
        }
      }
      return false;
    },

    dirDropDownSource: function (dirs, value) {
      var r = [],
        $sel = $("input.ide-dir_select", appui.ide.editor).data("kendoDropDownList"),
        o;
      if ( (dirs.toJSON !== undefined) && $.isFunction(dirs.toJSON) ){
        dirs = dirs.toJSON();
      }
      $.each(dirs, function (i, a) {
        if (a.tabs !== undefined) {
          for (var j in a.tabs) {
            o = {};
            if (j !== '_ctrl') {
              if (a.tabs[j].default) {
                o.bcolor = a.bcolor;
                o.fcolor = a.fcolor;
              }
              o.code = a.code;
              o.value = a.code + '/' + a.tabs[j].url;
              o.text = a.tabs[j].title;
              r.push($.extend({}, a.tabs[j], o));
            }
          }
        }
        else {
          a.value = a.code;
          r.push(a);
        }
      });
      $sel.setDataSource({
        data: r,
        group: {field: "code"}
      });
      if (!value) {
        appui.fn.log("NO VAL");
      }
      $sel.select(function (dataItem) {
        return dataItem.url ? (dataItem.code + '/' + dataItem.url === value) : (dataItem.code === value);
      });
    },

    test: function () {
      var $c = $("div.k-content.k-state-active div.code:visible", appui.ide.tabstrip),
          url = appui.ide.tabstrip.tabNav("getURL"),
          src = url.substr(0, url.indexOf('/')),
          path = appui.ide.tabstrip.tabNav("getObs").title,
          dir = data.dirs[src] !== undefined ? data.dirs[src] : false;
      appui.fn.log(path);
      if ( dir && $c.length ){
        if ( dir.is_mvc ) {
          appui.fn.link(path, 1);
          return 1;
        }
        var c = $c.codemirror("getValue"),
            m = $c.codemirror("getMode");
        if (typeof(m) === 'string') {
          switch (m) {
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
      var mode = appui.ide.currentSelection();
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
        mode = $("input[name=dir]", appui.fn.get_popup()).val(),
        treeDS = new kendo.data.HierarchicalDataSource({
          filterable: true,
          transport: {
            read: {
              dataType: "json",
              type: "POST",
              url: data.root + "tree",
              data: {
                mode: mode,
                onlydir: true
              },
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
      appui.fn.alert('<div class="tree"></tree>', 'Choose directory', 250, 500, function (ele) {
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

    delete: function (dataItem, treeDS) {
      var msg;
      if (dataItem.icon === 'folder') {
        msg = "Are you sure that you want to delete the folder " + dataItem.path + " and all its content?";
      }
      else {
        msg = "Are you sure that you want to delete the file " + dataItem.path + "?";
      }
      if (confirm(msg)) {
        appui.fn.post(data.root + "actions/delete", {
          path: dataItem.path,
          id: dataItem.id,
          type: dataItem.type,
          name: dataItem.name,
          uid: dataItem.uid,
          dir: appui.ide.currentSelection()
        }, function (d) {
          var files = d.sub_files.length ? d.sub_files : d.tab_url;
          $.each(files, function (i, v) {
            var idx = appui.ide.tabstrip.tabNav("search", v);
            if (idx !== -1) {
              appui.ide.tabstrip.tabNav("close", idx);
            }
          });
          treeDS.remove(dataItem);
        })
      }
    },

    rename: function (dataItem) {
      var src = appui.ide.currentSrc();
      appui.fn.log(dataItem, data, src);
      appui.fn.alert($("#ide_rename_template").html(), 'Rename element', 450, 100, function(ele){
        $("input[name=name]", ele).val(dataItem.name).focus();
        $("input[name=uid]", ele).val(dataItem.uid);
        $("input[name=dir]", ele).val(src);
        $("input[name=path]", ele).val(dataItem.path ? dataItem.path : './');
        if ( data.dirs[src].is_mvc ) {
          var cb = '<div class="appui-form-label">Update permissions</div>' +
            '<div class="appui-form-field">' +
            '<input type="checkbox" id="cb_upd_perms" class="k-checkbox" val="1">' +
            '<label class="k-checkbox-label" for="cb_upd_perms"></label>' +
            '</div>';
          $('input.appui-form-field:last', 'form', ele).after($(cb));
        }
        $("form", ele).attr("action", data.root + "actions/rename").data("script", function(d){
          if (d.success && d.new_file) {
            var uid = $("input[name=uid]", ele).val(),
              tree = $('div.tree', appui.ide.editor).data('kendoTreeView'),
              upd_perms = $("#cb_upd_perms:checked").val();
            appui.fn.closeAlert();
            if (uid) {
              var item = tree.findByUid(uid),
                dataItem = tree.dataItem(item),
                dataParent = dataItem.parentNode();
              if (dataParent === undefined) {
                dataItem.loaded(false);
                tree.one("dataBound", function (e) {
                  e.sender.expandPath([d.new_file]);
                });
                tree.dataSource.read();
              }
              else {
                var tmp = [dataParent, dataItem];
                dataItem.loaded(false);
                dataParent.loaded(false);
                tree.one("dataBound", function (e) {
                  e.sender.expandPath([dataParent.path, d.new_file]);
                });
                dataParent.load();
              }
            }
            else {
              tree.dataSource.read();
            }
            var url = $sel.value() + '/' + dataItem.path,
              idx = appui.ide.tabstrip.tabNav("search", url),
              tab;
            if (idx !== -1) {
              tab = appui.ide.tabstrip.tabNav("getObs", idx);
              appui.ide.tabstrip.tabNav("setTitle", d.new_file.replace(/^.*[\\\/]/, ''), tab.url);
              tab.url = $sel.value() + '/' + d.new_file + (d.new_file_ext ? '.' + d.new_file_ext : '.php');
              if (appui.ide.tabstrip.tabNav("getSubTabNav", tab.url)) {
                appui.ide.tabstrip.tabNav("getSubTabNav", tab.url).options.baseURL = data.root + "editor/" + tab.url + "/";
              }
              appui.ide.tabstrip.tabNav("activate", tab.url);
            }
            if (upd_perms) {
              appui.ide.update_permissions();
            }
          }
        });
      });
    },

    load: function(path, dir){
      appui.fn.post(data.root + 'load', {
        dir: dir,
        file: path
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
              $(this).codemirror("settheme", data.theme);
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

    duplicate: function (dataItem) {
      var selectedValue = appui.ide.currentSelection(),
          dir = selectedValue.split('/')[0],
          cfg = data.dirs[dir];
      appui.fn.log(selectedValue, data.dirs);
      if ( cfg ) {
        //appui.fn.log(data.dirs, selectedValue);
        appui.fn.alert($("#ide_new_template").html(), 'Duplicate', 550, 170, function (ele) {
          ele.find("form").attr("action", data.root + '/action/copy');
          appui.var.tmp = dataItem.path.split("/");
          if (appui.var.tmp.length) {
            appui.var.tmp.pop();
          }
          $("input[name=act]", ele).val("duplicate");
          $("input[name=name]", ele).val(dataItem.name + ' - Copy').focus();
          $("input[name=dir]", ele).val(selectedValue);
          $("input[name=uid]", ele).val(dataItem.uid);
          $("input[name=path]", ele).val(appui.var.tmp.length ? appui.var.tmp.join('/') : './');
          $("input[name=src]", ele).val(dataItem.path);
          if (cfg.tabs !== undefined) {
            var cb = '<div class="appui-form-label">Update permissions</div>' +
              '<div class="appui-form-field">' +
              '<input type="checkbox" id="cb_upd_perms" class="k-checkbox" val="1">' +
              '<label class="k-checkbox-label" for="cb_upd_perms"></label>' +
              '</div>';
            $('input[name=path]', 'form', ele).closest('div.appui-form-field').after($(cb));
          }
          $("form", ele).keydown(function (e) {
            if (e.key === 'Enter') {
              e.preventDefault();
              $(this).trigger("submit");
            }
          }).attr("action", data.root + "actions").data("script", function (d) {
            if (d.success) {
              var uid = $("input[name=uid]", ele).val(),
                  tree = $('div.tree', appui.ide.editor).data('kendoTreeView'),
                  upd_perms = $("#cb_upd_perms:checked").val();
              appui.fn.closeAlert();
              if (uid) {
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
              if (upd_perms) {
                appui.ide.update_permissions();
              }
            }
          });
        });
      }
    },

    export: function (dataItem) {
      appui.fn.post_out(data.root + 'actions', {
        dir: appui.ide.currentSelection(),
        name: dataItem.name,
        path: dataItem.path,
        type: dataItem.type,
        act: 'export'
      }, function (d) {
        appui.app.notifs.wid.show("Exported!", "success");
      });
    },

    update_permissions: function (path) {
      appui.fn.alert($("#upd_perms_template").html(), 'Update permissions', 900, 700, function (pop) {
        appui.fn.post(data.root + 'permissions', {}, function (d) {
          if (d.data) {
            var tree_groups = $("div.tree_groups").kendoTreeView({
              dataSource: {
                data: d.data,
                sort: {
                  field: 'group',
                  dir: 'asc'
                }
              },
              dataTextField: 'group',
              checkboxes: true
            });
          }
        });
      });
    },

    newDir: function (path, uid) {
      var selectedValue = appui.ide.currentSelection(),
          cfg = data.dirs[selectedValue.split('/')[0]];
      if ( cfg ){
        appui.fn.alert($("#ide_new_template").html(), 'New directory', 540, 150, function (ele) {
          ele.find("form").attr("action", data.root + '/actions/create');
          $("input[name=name]", ele).focus();
          $("input[name=type]", ele).val('dir');
          $("input[name=dir]", ele).val(selectedValue);
          $("input[name=path]", ele).val(path ? path : './');
          if (uid) {
            $("input[name=uid]", ele).val(uid);
          }
          if (cfg.is_mvc !== undefined) {
            var cb = '<div class="appui-form-label">Update permissions</div>' +
              '<div class="appui-form-field">' +
              '<input type="checkbox" id="cb_upd_perms" class="k-checkbox" val="1">' +
              '<label class="k-checkbox-label" for="cb_upd_perms"></label>' +
              '</div>';
            $('input[name=path]', 'form', ele).closest('div.appui-form-field').after($(cb));
          }
          $("form", ele).keydown(function (e) {
            if (e.key === 'Enter') {
              e.preventDefault();
              $(this).trigger("submit");
            }
          }).data("script", function (d) {
            if (d.success) {
              var path = $("input[name=path]", ele).val(),
                dir = $("input[name=dir]", ele).val(),
                name = $("input[name=name]", ele).val(),
                tree = $('div.tree', appui.ide.editor).data('kendoTreeView'),
                upd_perms = $("#cb_upd_perms:checked").val();
              appui.fn.closeAlert();
              if (path && dir && name) {
                var ideDir = $('input.ide-dir_select').data("kendoDropDownList");
                if (ideDir.value() !== dir) {
                  ideDir.select(function (dataItem) {
                    return dataItem.value === dir;
                  });
                }
                tree.dataSource.read().then(function () {
                  if (path !== './') {
                    var pa = [],
                      p = path,
                      idx;
                    pa.push(p);
                    while ((idx = p.lastIndexOf('/')) != -1) {
                      p = p.substring(0, idx);
                      pa.push(p);
                    }
                    tree.expandPath(pa.reverse());
                  }
                });
                if (upd_perms) {
                  appui.ide.update_permissions();
                }
              }
            }
          });
        });
      }
    },

    newFile: function (dir, path, uid) {
      var selectedValue = appui.ide.currentSelection(),
          dir = dir.split('/'),
          cfg = data.dirs[dir[0]],
          ext = [],
          extensions;
      if (cfg) {
        if (cfg.is_mvc && dir[1]) {
          for ( var n in cfg.tabs ){
            if ( cfg.tabs[n].url ===  dir[1] ){
              extensions = cfg.tabs[n].extensions;
              break;
            }
          }
        }
        else {
          extensions = cfg.extensions;
        }
        $.map(extensions, function(e){
          ext.push({text: '.' + e.ext, value: e.ext});
        });
        dir = dir.join('/');
        appui.fn.alert($("#ide_new_template").html(), 'New ' + cfg.text, 540, 130, function (ele) {
          ele.find("form").attr("action", data.root + '/actions/create');
          if (ext.length > 0) {
            if (ext.length > 1) {
              $("input[name=ext]").attr("type", "text").width("70px").kendoDropDownList({
                dataSource: ext,
                dataTextField: "text",
                dataValueField: "value"
              });
            }
            else {
              $("input[name=ext]", ele).val(ext[0].value);
            }
          }
          $("input[name=name]", ele).focus();
          $("input[name=type]", ele).val('file');
          $("input[name=dir]", ele).val(dir);
          $("input[name=path]", ele).val(path ? path : './');
          if (uid) {
            $("input[name=uid]", ele).val(uid);
          }
          if (dir === 'MVC') {
            var cb = '<div class="appui-form-label">Update permissions</div>' +
              '<div class="appui-form-field">' +
              '<input type="checkbox" id="cb_upd_perms" class="k-checkbox" val="1">' +
              '<label class="k-checkbox-label" for="cb_upd_perms"></label>' +
              '</div>';
            $('input[name=path]', 'form', ele).closest('div.appui-form-field').after($(cb));
          }
          $("form", ele).keydown(function (e) {
            if (e.key === 'Enter') {
              e.preventDefault();
              $(this).trigger("submit");
            }
          }).data("script", function (d) {
            if (d.success) {
              var path = $("input[name=path]", ele).val(),
                  dir = $("input[name=dir]", ele).val(),
                  name = $("input[name=name]", ele).val(),
                  ext = $("input[name=ext]", ele).val(),
                  tree = $('div.tree', appui.ide.editor).data('kendoTreeView'),
                  upd_perms = $("#cb_upd_perms:checked").val();
              appui.fn.closeAlert();
              if (path && dir && name) {
                var ideDir = $('input.ide-dir_select').data("kendoDropDownList");
                if (ideDir.value() !== dir) {
                  ideDir.select(function (dataItem) {
                    return dataItem.value === dir;
                  });
                }
                tree.dataSource.read().then(function () {
                  if (path === './') {
                    var n = tree.findByText(name + (ext && (ext !== 'php') ? '.' + ext : ''));
                    tree.select(n);
                    tree.trigger("select", {node: n});
                  }
                  else {
                    var pa = [],
                      p = path,
                      idx;
                    pa.push(p);
                    while ((idx = p.lastIndexOf('/')) != -1) {
                      p = p.substring(0, idx);
                      pa.push(p);
                    }
                    tree.expandPath(pa.reverse(), function () {
                      var n = tree.findByText(name + (ext && (ext !== 'php') ? '.' + ext : ''));
                      tree.select(n);
                      tree.trigger("select", {node: n});
                    });
                  }
                });
              }
              if (upd_perms) {
                appui.ide.update_permissions();
              }
            }
          });
        });
      }
    },

    save: function () {
      var v,
        $c = $("div.code:visible", appui.ide.tabstrip);
      if ($c.length) {
        var state = $c.codemirror("getState");
        appui.fn.post(data.root + "actions/save", {
          selections: state.selections,
          marks: state.marks,
          file: appui.env.path.substr(appui.ide.url.length + 1),
          act: 'save',
          code: state.value
        }, function (d) {
          if (d.success) {
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
          def: a.def ? a.url + '/' + a.def : false,
          callonce: function (m, n) {
            if (n.def) {
              this.callonce = false;
              appui.ide.tabstrip.tabNav("activate", n.def);
            }
          },
          content: a.cfg === undefined ?
            '<div class="appui-full-height"></div>' :
            '<div class="code appui-full-height"></div>',
          close: function (a, b, c) {
            return appui.ide.close(a, b, c);
          }
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
                if (wid.changed) {
                  ele.closest("div[data-role=tabstrip]").find("> ul > li").eq(idx).addClass("changed");
                }
                else {
                  ele.closest("div[data-role=tabstrip]").find("> ul > li").eq(idx).removeClass("changed");
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
      ele.tabNav({
        baseURL: url + '/',
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
              '"' + ( o.function ? ' onclick="' + o.function + '"' : '' ) + '>';
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
    }
  };

  $(window).resize(function () {
    setTimeout(function () {
      appui.ide.resize();
    }, 1000);
  });
}
