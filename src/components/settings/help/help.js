(() => {
  return {
    props: ['source'],
    methods: {
      savePermission(){
        let obj = {
                id: this.source.id,
                code: this.source.code,
                text: this.source.text,
                help: this.source.help || ''
              };

        if ( obj.id && obj.code.length && obj.text.length ){
          this.post(appui.plugins['appui-ide'] + '/permissions/save', obj, d => {
            if ( d.data && d.data.success ){
              appui.success(bbn._("Permission saved!"));
            }
            else {
              appui.error(bbn._("Error!"));
            }
          });
        }
      }
    }
  }
})();
