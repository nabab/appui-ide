/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 13/07/2017
 * Time: 17:57
 */

(() => {
  return {
    data(){
      return {
        search: "",
        matchCaseSearch: false
      }
    },
    methods: {
      focus(a){
        bbn.fn.log(arguments, a ,"FOCUS");
      },
      close(){
        var popup = bbn.vue.closest(this, "bbn-popup");
        popup.close();
      },
      searchInElement(){
        if ( this.search.length > 0 ){
          let url = this.source.url + '/search/' + this.source.repository ,
              path = this.source.path.slice();
              //bbn.fn.log('url1', url);
          if ( this.source.is_project ){
            if ( this.source.type === 'components' ){
              path = path.split('/');
              path.shift();
              path = path.join('/');
            }
            url += '_project_/' +  this.source.type + '/';

            if ( this.source.is_vue ){
              let name = this.source.path.slice();
              name = name.split('/').pop();
              url += '_vue_/' + name + '/';
            }
          }

          url += '_end_/' + this.typeSearch + '/_folder_/' + path + '/' + this.search;
          bbn.fn.log('url4', url);
          url = url.replace( '//',  '/');
          this.$nextTick(() => {
            bbn.fn.link( url, true);
          });
          this.close();
        }
      }
    },
    computed: {
      typeSearch(){
        if ( this.matchCaseSearch ){
          return bbn._('sensitive');
        }
        else{
          return bbn._('insensitive');
        }
      }
    }
  }
})();
