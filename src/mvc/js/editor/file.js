/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 28/01/2017
 * Time: 11:44
 */

 (() =>{
   return {}
 })();


/*
(() =>{
  return {
    methods: {
      // Checks from all tabs if any of the anonymous components has isChanged true
      hasCodeChanged(){
        let tabnav = this.$refs.file.$refs.tabstrip,
            res = false;
        if ( tabnav ){
          $.each(tabnav.tabs, (i,v) => {
            let t = tabnav.getVue(v.idx);
            if ( t.$refs && t.$refs.component && t.$refs.component[0].isChanged ){
              res = true;
            }
          });
        }
        return res;
      }
    },
    computed: {
      changedCode(){
        return this.hasCodeChanged()
      }
    }

  }
})();
*/
