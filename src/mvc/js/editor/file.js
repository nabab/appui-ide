/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 28/01/2017
 * Time: 11:44
 */
bbn.fn.log('data', data);
if ( (bbn.ide !== undefined) &&
  (data.file !== undefined) &&
  (data.mode !== undefined) &&
  (data.value !== undefined)
){
  /*var subTab = $(bbn.ide.$refs.tabstrip).tabNav('getSubTabNav', 'file/' + data.repository + data.file.path + data.file.name);
  if ( subTab.length ){
    $(subTab).tabNav('addData', {
      file: data.file,
      mode: data.mode
    }, (data.tab || 'code'));
  }*/
  bbn.ide.mkCodeMirror(ele, data);
}