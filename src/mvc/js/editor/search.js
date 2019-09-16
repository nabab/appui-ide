/**
 * Created by BBN Solutions.
 * User: Vito Fava
 * Date: 08/01/2018
 * Time: 12:57
 */

(() => {
  return {
    data(){
      return {
        typeSearch: this.source.typeSearch === 'insensitive' ? 'In' : 'Se',
        list: this.source.list,

      }
    },
    mounted(){
      appui.ide.search.searchInRepository =  '';
      appui.ide.showSearchContent= false;
    },
    methods:{      
      selectElement(node){
        if ( node.data.link ){
          let link = 'file/' + this.source.nameRepository +(this.source.isProject === true ? this.source.type +'/' : '' ) + node.data.link + '/_end_' + (node.data.tab ? '/' + node.data.tab : ''),
              tabStrip =  appui.ide.getRef('tabstrip');        
          if( node.data.code ){
            let i = tabStrip.router.getIndex('file/' + this.source.nameRepository + node.data.linkPosition );
            if ( i !== false ){
              tabStrip.activateIndex(i);
              let st = bbn.vue.find(tabStrip.getVue(i),'bbn-tabnav'),
                  idxSubTab = st.router.getIndex(node.data.tab ? node.data.tab : 'code'),
                  tab = st.getVue(idxSubTab),
                  code = bbn.vue.find( tab, 'bbn-code');
              st.activateIndex(idxSubTab);
              this.$nextTick(()=>{
                if ( code ){  
                  let start = {
                    line: node.data.line,
                    ch: node.data.position
                  },
                  end = {
                    line: node.data.line,
                    ch: this.source.search.length+node.data.position
                  };           
                  this.$nextTick(()=>{
                    code.cursorPosition(node.data.line, node.data.position);
                    tabStrip.load(link)
                  });
                }
              });
            }
            else{
              appui.ide.search.link = true;
              appui.ide.cursorPosition.line = node.data.line;
              appui.ide.cursorPosition.ch =node.data.position;
              tabStrip.load(link)
            }                
          }
          else{
            appui.ide.search.link = true;
            appui.ide.cursorPosition.line = 0;
            appui.ide.cursorPosition.ch = 0;
            tabStrip.load(link);
          }
        }
      }
    }
  }
})();
