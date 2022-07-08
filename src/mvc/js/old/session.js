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
          this.post(this.source.root + 'session', {
            type: newVal
          }, (d) => {
            if ( d.data ){
              this.items = d.data;
              this.$nextTick(() => {
                this.getRef('tree').updateData(true)
              })
            }
          })
        }
    	}
    }
  };
})();