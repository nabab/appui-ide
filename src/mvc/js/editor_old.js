// Tabstrip element for code
bbn.ide.tabstrip = $("#tabstrip_editor");

// Tabstrip's container
bbn.ide.editor = $(ele);

// The tree element
var $tree = $("div.tree", ele);
// The tree datasource
var treeDS = new kendo.data.HierarchicalDataSource({
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
          return $("input.ide-dir_select", ele).data("kendoDropDownList").value();
        },
        filter: function () {
          return $("input.ide-tree_search", ele).val();
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
$("div.bbn-ide", ele).kendoToolBar({
  items: [{
    template: '<input class="k-textbox ide-tree_search" type="text" placeholder="Search files in ">'
  }, {
    type: "separator"
  }, {
    template: '<input class="ide-dir_select" style="width: 300px;">'
  }, {
    type: "separator"
  }, {
    template: '<button class="k-button" title="Test code!" onclick="bbn.ide.test();"><i class="fas fa-magic"> </i></button>'
  }, {
    template: '<button class="k-button" title="Show History" onclick="bbn.ide.history();"><i class="fas fa-history"> </i></button>'
  }, {
    type: "separator"
  }, {
    template: function () {
      var st = '<ul class="menu">';
      $.each(data.menu, function (i, v) {
        st += bbn.ide.mkMenu(v);
      });
      st += '</ul>';
      return st;
    }
  }]
});

// Menu inside toolbar
$("ul.menu", ele).kendoMenu({
  direction: "bottom right"
}).find("a").on("mouseup", function () {
  $(this).closest("ul.menu").data("kendoMenu").close();
});

// Tree widget
$tree.kendoTreeView({
  dataTextField: "name",
  dragAndDrop: true,
  dataSource: treeDS,
  autoBind: false,
  /*
  select: function(e){
    e.preventDefault();
    var d = this.dataItem(e.node),
        dir = bbn.ide.currentSrc(),
        link = data.root + 'editor/' + dir + d.dir + d.name;
    if ( d.tab ){
      link += ('/' + d.tab);
    }
    this.select(e.node);
    bbn.ide.tabstrip.tabNav("link", link, {
      dir: dir,
      file: d.path,
      tab: d.tab ? d.tab : ''
    });
    //bbn.fn.log("X", d, bbn.ide.currentSrc());
    return;
    if ( r.has_index ){
      window.open(bbn.env.host + '/' + r.path);
    }
    else if ( r.is_viewable ){
      bbn.ide.load(r.path, bbn.ide.currentSrc(), r.tab);
    }
  },
  */
  drag: function(e){
    var dt = false;
    if ( (e.dropTarget !== undefined) &&
      ( dt = this.dataItem(e.dropTarget))
    ){
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
          ds = this.dataItem(e.sourceNode);
      bbn.fn.post(data.root + 'actions/move', {
        dest: dd.path,
        src: ds.path,
        dir: bbn.ide.currentSrc(),
        type: ds.type
      }, function(d){
        if ( d.data &&
          d.data.file_new &&
          d.data.file_url &&
          d.data.file_new_url
        ){
          bbn.ide.closeOpen(ds, d.data);
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
    if ( e.item.type === 'dir' ){
      return '<span class="k-sprite ' +
        ( e.item.icon ? e.item.icon : e.item.ext + '-icon') +
        '" style="color: ' + e.item.bcolor + '"> </span>'
        + e.item.name;
    }
    var dir = bbn.ide.currentSrc(),
        link = data.root + 'editor/code/' + dir + (e.item.dir ? e.item.dir : '') + e.item.name;
    if ( e.item.tab ){
      link += ('/' + e.item.tab);
    }
    return '<span class="k-sprite ' +
      ( e.item.icon ? e.item.icon : e.item.ext + '-icon') +
      '" style="color: ' + e.item.bcolor + '"> </span>' +
      '<a href="' + link + '">' + e.item.name + '</a>';
  }
});

// Menu on tree's items
$("ul.bbn-ide-context").kendoContextMenu({
  orientation: 'vertical',
  target: $tree,
  filter: "span.k-in",
  animation: {
    open: {effects: "fadeIn"},
    duration: 500
  },
  dataSource: [{
    text: '<i class="fas fa-plus"></i>New',
    cssClass: "bbn-tree-new-dir",
    encoded: false,
    items: [{
      text: '<i class="far fa-file"></i>File',
      cssClass: "bbn-tree-new-file",
      encoded: false
    }, {
      text: '<i class="fas fa-folder"></i>Directory',
      cssClass: "bbn-tree-new-dir",
      encoded: false
    }]
  }, {
    text: '<i class="far fa-files"></i>Duplicate',
    cssClass: "bbn-tree-duplicate",
    encoded: false
  }, {
    text: '<i class="far fa-file-archive"></i>Export',
    cssClass: "bbn-tree-export",
    encoded: false
  }, {
    text: '<i class="fas fa-pencil"></i>Rename',
    cssClass: "bbn-tree-rename",
    encoded: false
  }, {
    text: '<i class="far fa-trash"></i>Delete',
    cssClass: "bbn-tree-delete",
    encoded: false
  }, {
    text: '<i class="fas fa-sync-alt"></i>Refresh',
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
      bbn.ide.newDir(path, parent.uid || '');
    }
    else if ($(e.item).hasClass("bbn-tree-new-file")) {
      var path = dataItem.type === 'dir' ? dataItem.path : dataItem.path.substr(0, dataItem.path.lastIndexOf('/'));
      if (!path) {
        path = './';
      }
      bbn.ide.newFile(path);
    }
    else if ($(e.item).hasClass("bbn-tree-rename")) {
      bbn.ide.rename(dataItem);
    }
    else if ($(e.item).hasClass("bbn-tree-duplicate")) {
      bbn.ide.duplicate(dataItem);
    }
    else if ($(e.item).hasClass("bbn-tree-export")) {
      bbn.ide.export(dataItem);
    }
    else if ($(e.item).hasClass("bbn-tree-delete")) {
      bbn.ide.delete(dataItem, treeDS);
    }
  }
});

// Dropdown for directories
var $dirDropDown = $("input.ide-dir_select", ele).kendoDropDownList({
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

// Calling source for dropdown
bbn.ide.dirDropDownSource(data.dirs, data.current_dir);
// Select the dropdown
$dirDropDown.trigger("change");

// Search field
$("input.ide-tree_search", ele).on('keyup', function () {
  bbn.ide.filterTree(treeDS, $(this).val().toString().toLowerCase(), "name");
  //treeDS.read();
});

// Tabstrip initialization
bbn.ide.build(data.config, bbn.ide.tabstrip, data.root + 'editor', 'IDE - ');

// Set theme
if (data.theme) {
  $("div.code", ele).each(function () {
    $(this).codemirror("setTheme", data.theme);
  });
}

// Set font family
if (data.font) {
  $("div.CodeMirror", ele).css("font-family", data.font);
}
// Set font size
if (data.font_size) {
  $("div.CodeMirror", ele).css("font-size", data.font_size);
}



// Function triggered when closing tabs: confirm if unsaved
appui.tabnav.ele.tabNav("set", "close", function (){
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

/*
appui.tabstrip.ele.tabNav("addCallback", function(cont){
  bbn.ide.resize(cont);
}, bbn.ide.tabstrip);

appui.tabstrip.ele.tabNav("addResize", function(cont){
  setTimeout(function () {
    bbn.ide.resize(cont);
  }, 1000);
});

*/