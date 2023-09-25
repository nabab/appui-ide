// Javascript Document

(() => {
  return {
    props: ['source'],
    data(){
      return{
        //disabled: true,
        extension:{
          default: this.source.extension.default,
          ext: this.source.extension.ext,
          mode: this.source.extension.mode
        },
        btns: [
          'cancel', {
            text: "Confirm",
            title: "Confirm",
            class: "bbn-primary",
            icon: "nf nf-fa-check_circle",
            action: this.closeForm
          }]
      }
    },
    methods:{
      closeForm(){
        let popup = this.closest("bbn-popup"),
            form = this.closest('bbn-container').find('appui-ide-popup-directories-form-types');
        if (this.source.type === "tabs") {
          if ( this.source.action === 'edit' ){
            this.source.listTabs[this.source.idTab]['extensions'][this.source.idExt] = this.extension;
            form.$set(form.source.row, 'tabs' , JSON.stringify(this.source.listTabs));
          }
          else if ( this.source.action === 'create' ){
            this.source.listTabs[this.source.idTab]['extensions'].push(this.extension);
            form.$set(form.source.row, 'tabs' , JSON.stringify(this.source.listTabs));
          }
        }
        if ( this.source.type === "exts" ){
          if ( this.source.action === 'edit' ){
            this.source.extesionsTab[this.source.idExt] = this.extension;
            form.$set(form.source.row, 'extensions' , JSON.stringify(this.source.extesionsTab));

          }
          else if ( this.source.action === 'create' ){
            this.source.extesionsTab.push(this.extension);
            form.$set(form.source.row, 'extensions' , JSON.stringify(this.source.extesionsTab));
          }
        }
        let jsonEditor = form.getRef('jsonEditor');
        if (jsonEditor) {
          jsonEditor.reinit();
        }

        if (popup) {
          popup.close();
        }
      }
    }

  }
})();