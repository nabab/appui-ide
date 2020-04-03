/**
 * Created by BBN Solutions.
 * User: Vito Fava
 * Date: 08/01/2018
 * Time: 12:57
 */

(() => {
  return {
    props: ['source'],
    data(){
      return {
        typeSearch: this.source.typeSearch === 'insensitive' ? 'In' : 'Se',
        list: this.source.list,

      }
    },
    mounted(){
      let componentEditor =  this.closest('appui-ide-editor');
      componentEditor.search.searchInRepository =  '';
      componentEditor.showSearchContent = false;
    },
    methods:{
      selectElement(node){
        let componentEditor =  this.closest('appui-ide-editor');
        if ( node.data.link ){
          let link = 'file/' + this.source.nameRepository+'/'+(this.source.isProject === true ? this.source.type +'/' : '' ) + node.data.link + '/_end_',//; + (node.data.tab ? '/' + node.data.tab : ''),
              tabStrip = componentEditor.getRef('tabstrip');

          if( node.data.code ){
            let router = this.closest('bbn-router');
            if ( router ){
              //var a = router.findByKey(link).findByKey(node.data.uid).find('bbn-router').findByKey(node.data.tab).findByKey(link);
              bbn.fn.log("ssddds", router.findByKey(link), link)
            }


            /*if ( i !== false ){
              tabStrip.activateIndex(i);
              let st = bbn.vue.find(tabStrip.getVue(i),'bbn-routerv'),
                  idxSubTab = st.router.getIndex(node.data.tab ? node.data.tab : 'code'),
                  tab = st.getVue(idxSubTab),
                  code = bbn.vue.find( tab, 'bbn-code');
              st.activateIndex(idxSubTab);
              this.$nextTick(()=>{
                bbn.fn.log("sssss",code)
                if ( code ){
                  this.$nextTick(()=>{
                    code.cursorPosition(node.data.line, node.data.position);
                    tabStrip.load(link)
                  });
                }
              });
            }*/
           /* tabStrip.load(link)
            //let code = bbn.vue.findAllByKey(node.data.uid);
            bbn.fn.log("wwww", link, node.data,code)
              if ( code ){
                this.$nextTick(()=>{
                  code.cursorPosition(node.data.line, node.data.position);
                  tabStrip.load(link)
                });
              }*/
           
          }
          else{
            tabStrip.load(link+ (node.data.tab ? '/' + node.data.tab : ''));
          }
        }
      }
    }
  }
})();