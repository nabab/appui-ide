// Javascript Document
$("#apst_log_splitter").kendoSplitter({
  orientation: "vertical",
  panes: [{size: "40px", resizable: false }, {resizable: false}]
});
$("#log_viewer").codemirror({mode: "ruby", readOnly: true});
var log_file = $("#apst_log_splitter select:first").kendoDropDownList({
      change: function(e){
        onChange(e);
      }
    }),
    num_lines = $("#apst_log_splitter select:last").kendoDropDownList({
      change: function(e){
        onChange(e);
      }
    }),
    onChange = function(e, clear){
      var v = log_file.data("kendoDropDownList").value(),
          n = num_lines.data("kendoDropDownList").value();
      if ( v ){
        appui.f.post('ide/logs', {log: v, clear: clear ? 1 : "0", num_lines: n}, function(d){
          $("#log_viewer").codemirror("setOption", "value", d.content);
          appui.f.log($("#log_viewer").codemirror("getMode"));
        });
      }
    };
$("#apst_log_splitter button:first").click(function(e){
  onChange(e, 1);
});
$("#apst_log_splitter button:last").click(function(e){
  onChange(e);
});
