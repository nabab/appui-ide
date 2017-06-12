/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 28/01/2017
 * Time: 11:44
 */

(function(){
  bbn.vue.addComponent('file');

  var methods = $.extend({}, bbn.fn, bbn.ide.$options.methods);
  return {
    methods: methods,
    data: function(){
      return {
        options: bbn.opt
      };
    }
  };
})();



bbn.fn.log('data', data);
if ( (bbn.ide !== undefined) &&
  (data.file !== undefined) &&
  (data.mode !== undefined) &&
  (data.value !== undefined)
){
  bbn.fn.log(data.value, data.mode);
  bbn.ide.mkCodeMirror(ele, data);
}