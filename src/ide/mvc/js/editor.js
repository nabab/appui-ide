appui.f.IDE.tabstrip = $("#tabstrip_editor");
appui.f.IDE.editor = kappui.tabstrip.ele.tabNav("getContainer", appui.f.IDE.tabstrip);
appui.f.log(data);
var panel,
    $tree = $("div.tree", appui.f.IDE.editor),
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
            group: function(){
              if ( $("input.ide-dir_select", appui.f.IDE.editor).data("kendoDropDownList").value().length ){
                return $("input.ide-dir_select", appui.f.IDE.editor).data("kendoDropDownList").dataItem().group;
              }
            },
            mode: function(){
              return $("input.ide-dir_select", appui.f.IDE.editor).data("kendoDropDownList").value();
            },
            filter: function(){
              return $("input.ide-tree_search", appui.f.IDE.editor).val();
            }
          }
        }
      },
      schema: {
        data: "data",
        model: {
          id: "path",
          hasChildren: "is_parent",
          fields:{
            type: {type:"string"},
            name: {type:"string"},
            path: {type:"string"},
            has_index: {type:"bool"},
            is_parent: {type:"bool"}
          }
        }
      }
    });

$("div.apst_ide_container", appui.f.IDE.editor).kendoSplitter({
  orientation: "vertical",
  resize: function(e){
    $(e.sender.element).redraw();
  },
  panes: [
    { collapsible: false, resizable: false, size: "40px" },
    { collapsible: false, resizable: false, scrollable: false }
  ]
});

$("div.apst_code_container", appui.f.IDE.editor).kendoSplitter({
  orientation: "horizontal",
  resize: function(e){
    $(e.sender.element).redraw();
  },
  panes: [
    { collapsible: true, resizable: true, size: "200px" },
    { collapsible: true, resizable: true, scrollable: false },
    { collapsible: true, resizable: true, size: "200px", collapsed: true }
  ]
});

$("div.appui_ide", appui.f.IDE.editor).kendoToolBar({
  items: [{
    template: '<input class="k-textbox ide-tree_search" type="text" placeholder="Search files in ">'
  }, {
    type: "separator"
  }, {
    template: '<input class="ide-dir_select" style="width: 300px;">'
  }, {
    type: "separator"
  }, {
    template: function(){
      var st = '<ul class="menu">';
      appui.f.log("FILES");
      appui.f.log(data.menu);
      $.each(data.menu, function(i, v){
        st += appui.f.IDE.mkMenu(v);
      });
      st += '</ul>';
      return st;
    }
  }]
});

$("ul.menu", appui.f.IDE.editor).kendoMenu({direction:"bottom right"}).find("a").on("mouseup", function(){
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
    if ( r.has_index ){
      window.open(appui.v.host+'/'+r.path);
    }
    else if ( r.is_viewable ){
      var dir = $("input.ide-dir_select", appui.f.IDE.editor).data("kendoDropDownList").dataItem();
      appui.f.post(data.root + 'load', {
        dir: dir.group,
        subdir: dir.value,
        file: r.path
      }, function(d){
        if ( d.data ){
          if ( appui.f.IDE.tabstrip.tabNav("search", d.data.url) === -1 ) {
            appui.f.IDE.add(d.data);
          }
          appui.f.IDE.tabstrip.tabNav("activate", data.root + 'editor/' + d.data.url + (d.data.def ? '/' + d.data.def : ''));
          $tree.data("kendoTreeView").select(e.node);
          // Set theme
          if ( data.theme ){
            $("div.code", appui.f.IDE.editor).each(function(){
              $(this).codemirror("settheme", data.theme);
            });
          }
          // Set font
          if ( data.font ) {
            $("div.CodeMirror", appui.f.IDE.editor).css("font-family", data.font);
          }
          // Set font size
          if ( data.font_size ) {
            $("div.CodeMirror", appui.f.IDE.editor).css("font-size", data.font_size);
          }
        }
      });
    }
  },
  drag: function(e){
    var dt = false;
    if ( e.dropTarget !== undefined && ( dt = this.dataItem(e.dropTarget)) ){
      appui.f.log(dt);
      if ( !dt.parenthood ){
        if ( e.setStatusClass !== undefined ){
          e.setStatusClass("k-denied");
        }
        if ( e.setValid !== undefined ){
          e.setValid(false);
        }
      }
    }
  },
  drop: function(e){
    if ( e.valid ){
      var dd = this.dataItem(e.destinationNode),
          ds = this.dataItem(e.sourceNode),
          dir = $("input.ide-dir_select").data("kendoDropDownList").value();
      appui.f.post(data.root + 'actions', {dpath: dd.path, spath: ds.path, dir: dir, act: 'move'}, function(d){
        if ( d.success ) {
          dd.loaded(false);
          dd.load();
        }
        else{
          e.setValid(false);
        }
      });
    }
  },
  template: function(e){
    var sel = $("input.ide-dir_select").data("kendoDropDownList").dataItem(),
        color = false;
    if ( e.item.icon ){
      return '<span class="k-sprite ' + e.item.icon + '"></span>' + e.item.name;
    }
    else if ( e.item.ext ){
      color = appui.f.get_field(sel.files, 'ext', e.item.ext, 'bcolor');
      if ( !color ){
        color = sel.bcolor;
      }
      return '<span class="k-sprite ' + e.item.ext + '-icon" ' + (color ? 'style="color:' + color + '"' : '') + '></span>' + e.item.name;
    }
  }
});

$("ul.apst-ide-context").kendoContextMenu({
  orientation: 'vertical',
  target: $tree,
  filter: "span.k-in",
  animation: {
    open: { effects: "fadeIn" },
    duration: 500
  },
  dataSource: [{
    text: "Refresh",
    cssClass: "apst-tree-refresh"
  }, {
    text: "New Directory",
    cssClass: "apst-tree-new-dir"
  }, {
    text: "New File",
    cssClass: "apst-tree-new-file"
  }, {
    text: "Rename",
    cssClass: "apst-tree-rename"
  }, {
    text: "Duplicate",
    cssClass: "apst-tree-duplicate"
  }, {
    text: "Export",
    cssClass: "apst-tree-export"
  }, {
    text: "Delete",
    cssClass: "apst-tree-delete"
  }],
  select: function(e) {
    var msg,
        treeview = $tree.data("kendoTreeView"),
        item = $(e.target).closest("li"),
        dataItem = treeview.dataItem(item);
    if ( $(e.item).hasClass("apst-tree-refresh") ) {
      dataItem.loaded(false);
      treeview.one("dataBound", function(e) {
        e.sender.expandPath([dataItem.path]);
      });
      dataItem.load();
    }
    else if ( $(e.item).hasClass("apst-tree-new-dir") ){
      if ( dataItem.type === 'dir' ){
        var parent = dataItem,
            path =  dataItem.path;
      }
      else{
        var parent = dataItem.parentNode(),
            path =  dataItem.path.substr(0, dataItem.path.lastIndexOf('/'));
      }
      if ( !path ){
        path = './';
        parent = {};
      }
      appui.f.IDE.newDir(path, parent.uid || '');
    }
    else if ( $(e.item).hasClass("apst-tree-new-file") ){
      var path = dataItem.type === 'dir' ? dataItem.path : dataItem.path.substr(0, dataItem.path.lastIndexOf('/'));
      if ( !path ){
        path = './';
      }
      appui.f.IDE.newFile($("input.ide-dir_select", appui.f.IDE.editor).data("kendoDropDownList").value(), path);
    }
    else if ( $(e.item).hasClass("apst-tree-rename") ){
      appui.f.IDE.rename(dataItem);
    }
    else if ( $(e.item).hasClass("apst-tree-duplicate") ){
      appui.f.IDE.duplicate(dataItem);
    }
    else if ( $(e.item).hasClass("apst-tree-export") ){
      appui.f.IDE.export(dataItem);
    }
    else if ( $(e.item).hasClass("apst-tree-delete") ){
      appui.f.IDE.delete(dataItem, treeDS);
    }
  }
});

var $dirDropDown = $("input.ide-dir_select", appui.f.IDE.editor).kendoDropDownList({
  dataSource: [],
  dataTextField: "text",
  dataValueField: "value",
  change: function(e){
    var sel = e.sender.dataItem();
    if ( sel.bcolor ){
      e.sender.wrapper.find(".k-input").css({backgroundColor: sel.bcolor});
    }
    if ( sel.fcolor ){
      e.sender.wrapper.find(".k-input").css({color: sel.fcolor});
    }
    treeDS.read();
  }
}).data("kendoDropDownList");
appui.f.IDE.dirDropDownSource(data.dirs, data.current_dir);
$dirDropDown.trigger("change");

$("input.ide-tree_search", appui.f.IDE.editor).on('keyup', function(){
  treeDS.filter([{field: "name", operator: "contains", value: $(this).val()}]);
  //treeDS.read();
});

appui.f.IDE.build(data.config, appui.f.IDE.tabstrip, data.root + 'editor', 'IDE - ');

kappui.tabstrip.ele.tabNav("activate", data.url);

kappui.tabstrip.ele.tabNav("set", "close", function(){
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
}, data.root + 'editor');

// Set theme
if ( data.theme ) {
  $("div.code", appui.f.IDE.editor).each(function(){
    $(this).codemirror("settheme", data.theme);
  });
}

// Set font family
if ( data.font ) {
  $("div.CodeMirror", appui.f.IDE.editor).css("font-family", data.font);
}
// Set font size
if ( data.font_size ) {
  $("div.CodeMirror", appui.f.IDE.editor).css("font-size", data.font-size);
}

appui.f.IDE.tabstrip.resize();
