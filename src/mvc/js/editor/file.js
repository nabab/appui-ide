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
  bbn.fn.log(data.value, data.mode);
  bbn.ide.mkCodeMirror(ele, data);
}