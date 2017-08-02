/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 13/07/2017
 * Time: 17:57
 */
Vue.component('appui-ide-popup-new', {
  template: '#bbn-tpl-component-appui-ide-popup-new',
  props: ['source'],
  data(){
    return this.source;
  },
  mounted(){
    const vm = this;
    vm.$nextTick(() => {
      $(vm.$el).bbn('analyzeContent', true);
    });
  }
});


/*

var vm = this;
bbn.fn.popup($("#ide_new_template").html(), title, 540, false, {modal: true}, function(cont){
  new Vue({
    el: $(cont).get(0),
    data: $.extend({}, vm.$data, {
      title: title,
      isFile: isFile,
      path: path || './',
      types: [],
      selectedType: false,
      selectedExt: false,
      extensions: [],
      name: ''
    }),
    methods: {
      isMVC: vm.isMVC,
      setExtensions: function(extensions){
        var vm$ = this;
        vm$.extensions = $.map(extensions, function(ex){
          if ( ex.ext ){
            return {text: '.' + ex.ext, value: ex.ext};
          }
        });
        if ( vm$.extensions && vm$.extensions.length ){
          setTimeout(function(){
            vm$.selectedExt = vm$.extensions[0].value;
          }, 5);
        }
      },
      selectDir: function(){
        var vm$ = this;
        bbn.fn.popup('<div class="tree bbn-h-100" />', 'Select directory', 300, 500, function(w){
          w.addClass("bbn-ide-selectdir");
          $("div:first", w).fancytree({
            source: function(e, d){
              return vm.treeLoad(e, d, true, vm$.selectedType);
            },
            lazyLoad: function(e, d){
              d.result = vm.treeLoad(e, d, true, vm$.selectedType);
            },
            renderNode: function(e, d){
              if ( d.node.data.bcolor ){
                $("span.fancytree-custom-icon", d.node.span).css("color", d.node.data.bcolor);
              }
            },
            activate: function(e, d){
              vm$.path = d.node.data.path + '/';
              vm$.close();
            }
          });
        });

      },
      setRoot: function(){
        this.path = './'
      },
      close: function(){
        bbn.fn.closePopup();
      },
      response: function(d){
        var vm$ = this;
      }
    },
    watch: {
      selectedType: function(t, o){
        var vm$ = this;
        if ( vm$.isFile && (t !== o) ){
          vm$.extensions = [];
          if ( vm.repositories[vm.currentRep].tabs[t] && vm.repositories[vm.currentRep].tabs[t].extensions ){
            vm$.setExtensions(vm.repositories[vm.currentRep].tabs[t].extensions);
          }
        }
      }
    },
    mounted: function(){
      var vm$ = this,
          def,
          tabs = [];
      if ( vm.currentRep && vm.repositories && vm.repositories[vm.currentRep] ){
        bbn.fn.analyzeContent(vm$.$el);
        bbn.fn.redraw(vm$.$el, true);
        if ( vm.isMVC() ){
          tabs = $.map(vm.repositories[vm.currentRep].tabs, function(t){
            if ( t.fixed === undefined ){
              if ( t.default && ( t.url !== vm$.selectedType) ){
                def = t.url;
              }
              return {text: t.title, value: t.url};
            }
          });
          vm$.types = tabs;
          setTimeout(function(){
            vm$.selectedType = def || false;
          }, 5);
        }
        else if ( vm.repositories[vm.currentRep].extensions ){
          vm$.setExtensions(vm.repositories[vm.currentRep].extensions);
        }
        $(vm$.$refs.new_form.$el).on('submit', function(e){
          e.preventDefault();
          e.stopImmediatePropagation();
          if ( vm.currentRep &&
            vm.repositories &&
            vm.repositories[vm.currentRep] &&
            vm.repositories[vm.currentRep].bbn_path &&
            vm.repositories[vm.currentRep].path &&
            vm$.name &&
            vm$.path
          ){
            bbn.fn.post(vm.root + 'actions/create',
              $.extend({}, vm.makeActionData(vm.currentRep, vm$.selectedType), {
                extension: vm$.selectedExt,
                name: vm$.name,
                path: vm$.path,
                default_text: vm.getDefaultText(vm$.selectedExt, vm$.selectedType),
                is_file: vm$.isFile
              }), function(d){
                if ( d.success ){
                  vm$.close();
                }
              });
          }
        });
      }
    }
  });
});*/
