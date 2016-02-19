// Javascript Document
$("#error_json_grid").kendoGrid({
  filterable: true,
  sortable: true,
  pageable: {
    pageSize: 30
  },
  dataSource: {
    data: data,
    sort: {
      field: "last_date",
      dir: "desc"
    },
    schema: {
      data: "data",
      total: "total",
      model: {
        fields: [{
          field: "last_date",
          type: "date",
        }, {
          field: "first_date",
          type: "date"
        }, {
          field: "count",
          type: "number",
        }, {
          field: "type",
          type: "string"
        }, {
          field: "error",
          type: "string"
        }, {
          field: "file",
          type: "string"
        }, {
          field: "line",
          type: "number",
        }]
      }
    }
  },
  columns: [{
    field: "type",
    title: "Type",
    width: 80
  }, {
    field: "last_date",
    title: "Last",
    width: 100,
    template: function (e) {
      return appui.fn.fdate(e.last_date);
    }
  }, {
    field: "count",
    title: "#",
    width: 60
  }, {
    field: "error",
    title: "Error",
  }, {
    field: "file",
    title: "File",
  }, {
    field: "line",
    title: "Line",
    width: 60
  }, {
    field: "first_date",
    title: "First",
    width: 100,
    hidden: true,
    template: function (e) {
      return appui.fn.fdate(e.first_date);
    }
  }],
  detailInit: function (e) {
    appui.fn.log(e);
    var stable = $("<div/>");
    stable.appendTo(e.detailCell).kendoGrid({
      sortable: true,
      dataSource: {
        data: e.data.trace,
        sort: {
          field: "index",
          dir: "asc"
        },
        schema: {
          model: {
            fields: [{
              field: "index",
              type: "number",
            }, {
              field: "text",
              type: "string"
            }]
          }
        }
      },
      columns: [{
        field: "index",
        title: "#",
        width: 40
      }, {
        field: "text",
        title: "Message",
      }]
    });
  }
});
