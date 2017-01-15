if ( data.file && bbn.ide ){
  var cfg = bbn.ide.findCfg(data.file);
  if ( cfg ){
    var list = [];
    if ( cfg.tabs ){
      for ( var n in cfg.tabs ){
        list.push(bbn.ide.tabObj($.extend({url: data.file}, cfg.tabs[n])));
      }
    }
    $(".appui-h-100:first", ele).tabNav({
      baseURL: data.baseURL,
      list: list
    });
  }
}
