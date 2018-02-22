/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 28/01/2017
 * Time: 11:44
 */

(() =>{
  return {
    created(){
      bbn.vue.setComponentRule(this.source.root + 'components/', 'appui-ide');
      bbn.vue.addComponent('mvc');
      bbn.vue.addComponent('file');
      bbn.vue.unsetComponentRule();
    },
    data(){
      return this.source
    },
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
