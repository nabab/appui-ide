/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 28/01/2017
 * Time: 11:44
 */

(() =>{
  return {
    beforeMount(){
      bbn.vue.setComponentRule(this.source.root + 'components/', 'appui');
      if ( this.source.isMVC ){
        bbn.vue.addComponent('ide/mvc');
      }
      else {
        bbn.vue.addComponent('ide/file');
      }
      bbn.vue.unsetComponentRule();
    },
    data(){
      return this.source;
    }
  }
})();