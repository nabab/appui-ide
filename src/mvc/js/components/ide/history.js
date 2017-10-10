/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 05/06/2017
 * Time: 14:40
 */
Vue.component('appui-ide-history', {
  template: '#bbn-tpl-component-appui-ide-history',
  props: ['source'],
  data(){
    return $.extend({
      selected: '',
      mode: '',
      code: ''
    }, this.source);
  },
  methods: {
    /*treeLoad( ){
      if ( this.repository &&
        this.repositories[this.repository] &&
        this.repositories[this.repository].bbn_path &&
        this.repositories[this.repository].path &&
        (this.path !== undefined) &&
        this.filename
      ){
        bbn.fn.log('AAAAAAAAAAAAAAAAAAdsdsdAAA');
        const url = this.repositories[this.repository].bbn_path + '/' +
          this.repositories[this.repository].path +
          (this.path ? this.path + '/' : '') +
          this.filename +
          '/__end__';
       /* return bbn.fn.post(this.root + 'history/tree', {
          url: url,
          is_mvc: this.isMVC,
          ext: !this.isMVC && this.ext ? this.ext : false
        }).promise().then((pd) => {
          return pd.data;
        });
      }
    },*/
    treeLazyLoad(e, d){
      d.result = this.treeLoad(e, d);
    },
    treeNodeActivate(id, d, n){
      if ( !n.folder ){
        this.selected = n.key;
        this.code = d.code;
        this.mode = d.mode;
        this.$forceUpdate();
      }
    }
  },
  computed:{
    treeLoad(){
      if ( this.repository &&
        this.repositories[this.repository] &&
        this.repositories[this.repository].bbn_path &&
        this.repositories[this.repository].path &&
        (this.path !== undefined) &&
        this.filename
      ){


        const url = this.repositories[this.repository].bbn_path + '/' +
          this.repositories[this.repository].path +
          (this.path ? this.path + '/' : '') +
          this.filename +
          '/__end__';
        bbn.fn.log(this.repositories[this.repository].bbn_path);
        bbn.fn.log(this.repositories[this.repository].path);
        bbn.fn.log(this.path);
        bbn.fn.log(this.filename + '/__end__');
        bbn.fn.log(url);
        bbn.fn.log('AAAAAAAAAAAAAAAAAAdsdsdAAA');
        return  {
          url: url,
          is_mvc: this.isMVC,
          ext: !this.isMVC && this.ext ? this.ext : false
        };
        return objSend
      }
    }
  },
  mounted(){
    bbn.fn.log("HISTORYYYY", this)
    this.$nextTick(() => {
      $(this.$el).bbn('analyzeContent', true);
    });
  }
});