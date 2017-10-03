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
    return {
      obj: {
        tab:'',
        name: '',
        extension: '',
        path: this.source.node && this.source.node.data && this.source.node.data.path ? this.source.node.data.path : './',
        is_file: this.source.isFile,
      },
      obj2:{
        tab_path: this.tab_path,
        default_text: this.text_default,
        repository: this.source.repositories[this.source.currentRep]
      },
      extensions: [],
      selectedType: '',
    }
  },
  methods: {
    successActive(){
      if(this.source.isFile){
        appui.success(bbn._("File created!"));
        bbn.fn.link(this.source.root +
          'editor/file' +
           this.source.currentRep +
           (path.startsWith('./') ? path.slice(2) : path) +
           this.name +
           '/_end_' +
           (this.selectedType.length ? '/' + this.selectedType : '')
        );
      }else{
         appui.success(bbn._("Directory created!"));
      }
      bbn.vue.closest(this, ".bbn-popup").close();
      const tab = bbn.vue.closest(this, ".bbn-tab");
      tab.$children[0].$refs.filesList.reload();
alert("ciao")
    },
    selectDir(){
      bbn.vue.closest(this, ".bbn-tab").$refs.popup[0].open({
        width: 300,
        height: 400,
        title: bbn._('Path'),
        component: 'appui-ide-popup-path',
        source: $.extend( {}, this.$data, this.source)
      });
    },
    setExtensions(){
      console.log("SETEXTENSION", this.isMVC ,  this.selectedType , this.selectedType.length);

      let res = [],
          ext = ( this.isMVC && this.selectedType.length ) ?
            this.source.repositories[this.source.currentRep].tabs[this.selectedType].extensions :
            this.source.repositories[this.source.currentRep].extensions;
      if ( ext.length ){
        $.each(ext, (i, v) =>{
          res.push({
            text: '.' + v.ext,
            value: v.ext
          });
        });
      }
      console.log("EXXXXXXXXX", ext, res);
      this.extensions = res;

      if ( this.extensions.length ){
        setTimeout(() =>{
          this.obj.extension = this.extensions[0].value;
        }, 100);
      }
    },
    close(){
      alert("close");
      const popup = bbn.vue.closest(this, ".bbn-popup");
      popup.close();
      //popup.close(popup.num - 1);
    }
  },
   /* success(){

    },
    submit(){
      console.log("dsds", this);
      alert("submit");
      if ( this.currentRep &&
        this.repositories[this.currentRep] &&
        this.name.length &&
        this.path.length &&
        ( !this.isFile || (this.isFile && this.selectedExt.length) ) &&
        ( !this.isMVC || (this.isMVC && this.selectedType.length && this.repositories[this.currentRep].tabs[this.selectedType]) )
      ){

        const rep = this.repositories[this.currentRep],
              ext = this.isMVC ? rep.tabs[this.selectedType].extensions : rep.extensions,
              path = this.path.endsWith('/') ? this.path : this.path + '/';
        bbn.fn.post(this.root + 'actions/create', {
          is_file: this.isFile,
          repository: rep,
          path: path,
          name: this.name,
          extension: ctedExtthis.sele,
          tab: this.selectedType,
          tab_path: this.isMVC && rep.tabs[this.selectedType] ? rep.tabs[this.selectedType].path : '',
          default_text: bbn.fn.get_field(ext, 'ext', this.selectedExt, 'default') || ''
        }, d => {
          if ( d.success ){
            if ( this.isFile ){
              appui.success(bbn._("File created!"));
              bbn.fn.link(
                this.root +
                'editor/file/' +
                this.currentRep +
                (path.startsWith('./') ? path.slice(2) : path) +
                this.name +
                '/_end_' +
                (this.selectedType.length ? '/' + this.selectedType : '')
              );

              //var treeNode = bbn.vue.closest(bbn.vue.closest(bbn.vue.closest(this, '.bbn-tab'), '.bbn-tabnav'), '.bbn-splitter').getComponent();
            //    console.log("TREE", treeNode);

            }
            else {
              appui.success(bbn._("Directory created!"));
            }
            /** @todo Refresh the files list */
            /*if ( this.source.node ){

            }
            else {

            }*/
       /*     bbn.vue.closest(this, ".bbn-popup").close();
            const tab = bbn.vue.closest(this, ".bbn-tab");
            tab.$children[0].$refs.filesList.reload();
          }
          else {
            appui.error(bbn._("Error!"));
          }
        });
      }
    }                                                       height
  }, */
  computed: {
    types(){
      let res = [];
      if ( this.isMVC ){
        $.each(this.source.repositories[this.source.currentRep].tabs, (i, v) => {
          if ( !v.fixed ){
            res.push({
              text: v.title,
              value: i
            });
          }
        });
      }
      return res;
    },
    isMVC(){
      return (this.source.repositories[this.source.currentRep] !== undefined ) && (this.source.repositories[this.source.currentRep].tabs !== undefined);
    },
    rep(){
      return this.source.repositories[this.source.currentRep];
    },
    ext(){
      return this.isMVC ? this.rep.tabs[this.obj.tab].extensions : this.rep.extensions
    },
    tab_path(){
      this.$data.obj2.tab_path = this.isMVC && this.rep.tabs[this.obj.tab] ? this.rep.tabs[this.obj.tab].path : '';
      return this.isMVC && this.rep.tabs[this.obj.tab] ? this.rep.tabs[this.obj.tab].path : '';
    },
    text_default(){
      this.$data.obj2.default_text = bbn.fn.get_field(this.ext, 'ext', this.obj.tab, 'default') || '';
       return bbn.fn.get_field(this.ext, 'ext', this.obj.tab, 'default') || '';
    }
  },

  watch: {
    selectedType(){
      this.obj.tab = this.selectedType;
      console.log("aaaaassss", this.selectedType);

      if ( this.source.isFile ){
        this.setExtensions();
      }
    }
  },
  mounted(){
    console.log("SOURCEDSDD", this);

    if ( this.source.isFile ){
      this.setExtensions();
    }

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
