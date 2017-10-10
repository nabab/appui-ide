// Javascript Document
var grid = $("#bbn_cache_items_grid");
grid.kendoGrid({
  sortable: true,
  filterable: {
    extra: false,
    mode: "row"
  },
  columns: [{
    field: "name",
    title: "Item",
  }, {
    width: 100,
    title: "Actions",
    command: [
      {
        text : "<i class='fa fa-eye' title='See content'> </i>",
        name : "Content",
        command: function(e){
          var tr = $(e.target).closest("tr"),
            dataItem = this.dataItem(tr).toJSON();
          bbn.fn.window(data.root + "cache/info", {item: dataItem.name}, "80%", "40%");
        }
      }, {
        text : "<i class='fa fa-times' title='Delete'> </i>",
        name : "Clear",
        command: function(e){
          var tr = $(e.target).closest("tr"),
            dataItem = this.dataItem(tr).toJSON();
          bbn.fn.post(data.root + "cache/delete", {item: dataItem.name}, function(d){
            if ( d.success ){
              grid.data('kendoGrid').removeRow(tr);
            }
            else{
              bbn.fn.alert("Impossible to remove the cache entry");
            }
          });
        }
      }
    ]
  }],
  dataSource: {
    data: data.items,
  }
});
