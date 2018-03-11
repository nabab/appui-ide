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
        typeSearch: this.source.typeSearch === 'insensitive' ? 'In' : 'Se'
      }
    },
    mounted(){
      appui.ide.search.searchInRepository =  '';
      appui.ide.showSearchContent= false;
    },
    methods:{
      selectElement(node){
        if ( node.data.forLink ){
          let link = 'file/' + this.source.nameRepository + node.data.forLink + '/_end_' + (node.data.tab ? '/' + node.data.tab : '');
          appui.ide.$refs.tabstrip.load(link);
        }
        if( node.data.code ){
          let link = 'file/' + this.source.nameRepository + node.data.linkPosition + '/_end_' + (node.data.tab ? '/' + node.data.tab : ''),
              tabStrip = appui.ide.$refs.tabstrip,
              i = tabStrip.getIndex('file/' + this.source.nameRepository + node.data.linkPosition );
          if ( i !== false ){
            tabStrip.activateIndex(i);
            let st = bbn.vue.find(tabStrip.getVue(i),'bbn-tabnav'),
                idxSubTab = st.getIndex(node.data.tab ? node.data.tab : 'code'),
                tab = st.getVue(idxSubTab);

                bbn.fn.log('ss',tab)
                let code = bbn.vue.find( tab, 'bbn-code');

                console.log('code', code)
            st.activateIndex(idxSubTab);
            if( code ){
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
                /*setTimeout(()=>{
                   code.widget.getDoc().setSelections([{'anchor': start, 'head': end}]);
                   appui.ide.search.link = true;
                 },200);*/
                 tabStrip.load(link)
              });
            }
          }
          else{
            appui.ide.search.link = true;
            appui.ide.cursorPosition.line = node.data.line;
            appui.ide.cursorPosition.ch =node.data.position;
            appui.ide.$refs.tabstrip.load(link)
          }
        }
      }
    }
  }
})();
