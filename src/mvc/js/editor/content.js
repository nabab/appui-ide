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
         rep: appui.ide.repositories[appui.ide.currentRep],
       }
     },
     computed:{
       isMVC(){
         return ((appui.ide.isComponent === false) && (this.rep.alias_code === 'mvc')) || (bbn.vue.closest(this, 'appui-ide-mvc') !== false);
       }
     }
   }
 })();
