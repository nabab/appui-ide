// Javascript Document
(() => {
  return {
    data(){
      return {
        root: appui.plugins['appui-ide'],
        base64: ''
      }
    },
    methods: {
      success(num, filename, data){
        bbn.fn.log(num, filename, data);
        if ( data.res ){
          bbn.fn.log("DATA IS HERE");
          this.base64 = data.res;
        }
      }
    }
  }
})();
