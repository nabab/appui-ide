$(function(){
  appui.fn.log(data);
  appui.ide.tabstrip = $("#tabstrip_editor");
  appui.ide.editor = appui.app.tabstrip.ele.tabNav("getContainer", appui.ide.tabstrip);
  var panel,
    $tree = $("div.tree", appui.ide.editor),
    treeDS = new kendo.data.HierarchicalDataSource({
      filterable: true,
      loadOnDemand: false,
      /** @todo add serverFiltering: true, */
      transport: {
        read: {
          dataType: "json",
          type: "POST",
          url: data.root + "tree",
          data: {
            dir: function () {
              return $("input.ide-dir_select", appui.ide.editor).data("kendoDropDownList").value();
            },
            filter: function () {
              return $("input.ide-tree_search", appui.ide.editor).val();
            }
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

  $("div.bbn_ide_container", appui.ide.editor).kendoSplitter({
    orientation: "vertical",
    resize: function (e) {
      $(e.sender.element).redraw();
    },
    panes: [
      {collapsible: false, resizable: false, size: "40px"},
      {collapsible: false, resizable: false, scrollable: false}
    ]
  });

  $("div.bbn_code_container", appui.ide.editor).kendoSplitter({
    orientation: "horizontal",
    resize: function (e) {
      $(e.sender.element).redraw();
    },
    panes: [
      {collapsible: true, resizable: true, size: "200px"},
      {collapsible: true, resizable: true, scrollable: false},
      {collapsible: true, resizable: true, size: "200px", collapsed: true}
    ]
  });

  $("div.appui_ide", appui.ide.editor).kendoToolBar({
    items: [{
      template: '<input class="k-textbox ide-tree_search" type="text" placeholder="Search files in ">'
    }, {
      type: "separator"
    }, {
      template: '<input class="ide-dir_select" style="width: 300px;">'
    }, {
      type: "separator"
    }, {
      template: '<button class="k-button" title="Test code!" onclick="appui.ide.test();"><i class="fa fa-magic"> </i></button>'
    }, {
      type: "separator"
    }, {
      template: function () {
        var st = '<ul class="menu">';
        $.each(data.menu, function (i, v) {
          st += appui.ide.mkMenu(v);
        });
        st += '</ul>';
        return st;
      }
    }]
  });

  $("ul.menu", appui.ide.editor).kendoMenu({
    direction: "bottom right"
  }).find("a").on("mouseup", function () {
    $(this).closest("ul.menu").data("kendoMenu").close();
  });

  $tree.kendoTreeView({
    dataTextField: "name",
    dragAndDrop: true,
    dataSource: treeDS,
    autoBind: false,
    select: function(e){
      e.preventDefault();
      var r = this.dataItem(e.node);
      if (r.has_index) {
        window.open(appui.env.host + '/' + r.path);
      }
      else if ( r.is_viewable ){
        appui.ide.load(r.path, appui.ide.currentSrc(), r.tab);
      }
      this.select(e.node);
    },
    drag: function (e) {
      var dt = false;
      if (e.dropTarget !== undefined && ( dt = this.dataItem(e.dropTarget))) {
        //appui.fn.log(dt);
        if (!dt.parenthood) {
          if (e.setStatusClass !== undefined) {
            e.setStatusClass("k-denied");
          }
          if (e.setValid !== undefined) {
            e.setValid(false);
          }
        }
      }
    },
    drop: function (e) {
      if (e.valid) {
        var dd = this.dataItem(e.destinationNode),
          ds = this.dataItem(e.sourceNode),
          dir = $("input.ide-dir_select").data("kendoDropDownList").value();
        appui.fn.post(data.root + 'actions', {dpath: dd.path, spath: ds.path, dir: dir, act: 'move'}, function (d) {
          if (d.success) {
            dd.loaded(false);
            dd.load();
          }
          else {
            e.setValid(false);
          }
        });
      }
    },
    template: function(e){
      return '<span class="k-sprite ' + ( e.item.icon ? e.item.icon : e.item.ext + '-icon') + '" style="color: ' + e.item.bcolor + '"></span>' + e.item.name;
    }
  });

  $("ul.bbn-ide-context").kendoContextMenu({
    orientation: 'vertical',
    target: $tree,
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
        treeview = $tree.data("kendoTreeView"),
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
        appui.ide.newDir(path, parent.uid || '');
      }
      else if ($(e.item).hasClass("bbn-tree-new-file")) {
        var path = dataItem.type === 'dir' ? dataItem.path : dataItem.path.substr(0, dataItem.path.lastIndexOf('/'));
        if (!path) {
          path = './';
        }
        appui.ide.newFile(path);
      }
      else if ($(e.item).hasClass("bbn-tree-rename")) {
        appui.ide.rename(dataItem);
      }
      else if ($(e.item).hasClass("bbn-tree-duplicate")) {
        appui.ide.duplicate(dataItem);
      }
      else if ($(e.item).hasClass("bbn-tree-export")) {
        appui.ide.export(dataItem);
      }
      else if ($(e.item).hasClass("bbn-tree-delete")) {
        appui.ide.delete(dataItem, treeDS);
      }
    }
  });

  var $dirDropDown = $("input.ide-dir_select", appui.ide.editor).kendoDropDownList({
    dataSource: [],
    dataTextField: "text",
    dataValueField: "value",
    change: function (e) {
      var sel = e.sender.dataItem();
      if (sel && sel.bcolor) {
        e.sender.wrapper.find(".k-input").css({backgroundColor: sel.bcolor});
      }
      if (sel && sel.fcolor) {
        e.sender.wrapper.find(".k-input").css({color: sel.fcolor});
      }
      treeDS.read();
    }
  }).data("kendoDropDownList");

  appui.ide.dirDropDownSource(data.dirs, data.current_dir);
  $dirDropDown.trigger("change");

  $("input.ide-tree_search", appui.ide.editor).on('keyup', function () {
    treeDS.filter([{field: "name", operator: "contains", value: $(this).val()}]);
    //treeDS.read();
  });

  appui.ide.build(data.config, appui.ide.tabstrip, data.root + 'editor', 'IDE - ');

  //appui.app.tabstrip.ele.tabNav("activate", data.url);

  appui.app.tabstrip.ele.tabNav("set", "close", function () {
    var conf = false;
    $(".ui-codemirror").each(function () {
      if ($(this).codemirror("isChanged")) {
        conf = 1;
      }
    });
    if (conf) {
      return confirm($.ui.codemirror.confirmation);
    }
    return 1;
  }, data.root + 'editor');

  // Set theme
  if (data.theme) {
    $("div.code", appui.ide.editor).each(function () {
      $(this).codemirror("setTheme", data.theme);
    });
  }

  // Set font family
  if (data.font) {
    $("div.CodeMirror", appui.ide.editor).css("font-family", data.font);
  }
  // Set font size
  if (data.font_size) {
    $("div.CodeMirror", appui.ide.editor).css("font-size", data.font_size);
  }

  appui.app.tabstrip.ele.tabNav("addCallback", function(){
    appui.ide.tabstrip.resize();
  }, appui.ide.tabstrip);

});