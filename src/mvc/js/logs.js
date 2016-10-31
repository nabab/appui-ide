// Javascript Document
var $ele = $("#bbn_log_splitter", ele);
$ele.kendoSplitter({
  orientation: "vertical",
  panes: [
    {size: "40px", collapsible: false, resizable: false, scrollable: false},
    {collapsible: false, resizable: false, scrollable: false}],
  resize: function(e){
    var $lv = $("#log_viewer", $ele);
    if ( $lv.hasClass("ui-codemirror") ){
      this.element.redraw();
      //$lv.codemirror("refresh");
    }
  }
});
var log_file = $("select:first", $ele).kendoDropDownList({
    change: function (e) {
      onChange(e);
    }
  }),
  num_lines = $("select:last", $ele).kendoDropDownList({
    change: function (e) {
      onChange(e);
    }
  }),
  onChange = function (e, clear) {
    var v = log_file.data("kendoDropDownList").value(),
      n = num_lines.data("kendoDropDownList").value();
    if (v) {
      appui.fn.post(data.root + 'logs', {log: v, clear: clear ? 1 : "0", num_lines: n}, function (d) {
        $ele.parent().redraw();
        $("#log_viewer", $ele).codemirror("setValue", d.content);
      });
    }
  };
$("button:first", $ele).click(function (e) {
  onChange(e, 1);
});
$("button:last", $ele).click(function (e) {
  onChange(e);
});
$("#log_viewer", $ele).codemirror({
  mode: "ruby",
  readOnly: true
});
$ele.trigger("resize");
onChange();