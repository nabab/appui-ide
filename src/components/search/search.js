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
        files: this.source.files !== undefined ? this.source.files : []
      }
    },
    mounted(){
      let componentEditor =  this.closest('appui-ide-editor');
      componentEditor.search.searchInRepository =  '';
      componentEditor.showSearchContent = false;
    },
    methods:{
      selectElement(node){
        let componentEditor =  this.closest('appui-ide-editor'),
            tabStrip = componentEditor.getRef('tabstrip'),
            link = 'file/';

        if ( node.data.link ){
          if ( this.source.all ){
            link += node.data.link + '/_end_/'
          }
          else{
            link += this.source.nameRepository+'/'+(this.source.isProject === true ? this.source.type +'/' : '' ) + node.data.link + '/_end_/';
          }

          if ( node.data.line ){
            componentEditor.currentLine = node.data.line+1;
          }
          tabStrip.load(link+ (node.data.tab ? node.data.tab : 'code'));
        }
      }
    }
  }
})();