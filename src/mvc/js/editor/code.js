if ( data.file && appui.ide ){
  var cfg = appui.ide.findCfg(data.file);
  if ( cfg ){
    var list = [];
    if ( cfg.tabs ){
      for ( var n in cfg.tabs ){
        list.push(appui.ide.tabObj($.extend({url: data.file}, cfg.tabs[n])));
      }
    }
    $(".appui-h-100:first", ele).tabNav({
      baseURL: data.baseURL,
      list: list
    });
  }
}
