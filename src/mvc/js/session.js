// Javascript Document
(() => {
  return {
    props: ['source'],
    data(){
      return {
        type: false,
        items: []
      }
    },
    watch: {
      type(newVal){
        if ( newVal ){
          bbn.fn.post(this.source.root + 'session', {
            type: newVal
          }, (d) => {
            if ( d.data ){
              this.items = d.data;
            }
          })
        }
    	}
    }
  };
})();