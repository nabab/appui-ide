// Javascript Document
(()=>{
  return {
    data(){
      return {
        shpw: false,
        className: "",
        allInfo: false
      }
    },
    methods:{
      detInfo(){
        bbn.fn.post('docs', {class : this.className}, d =>{
          if ( d.success ){
            this.allInfo = d.infos
          }
        })
      }
    },
    watch:{
      allInfo(){
        this.$set(this, 'show', false);
        this.$nextTick(()=>{
          this.$set(this, 'show', true);
        })
      }
    }
  }
})();