/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 07/07/2017
 * Time: 16:11
 */


 (() => {
   return {
     props: ['source'],
     data(){
       return {
         rep: this.closest('appui-ide-editor').repositories[this.closest('appui-ide-editor').currentRep],
       }
     },
     computed:{
       isMVC(){
         return ((this.closest('appui-ide-editor').isComponent === false) && (this.rep.alias_code === 'mvc')) || (bbn.vue.closest(this, 'appui-ide-mvc') !== false);
       }
     }
   }
 })();
