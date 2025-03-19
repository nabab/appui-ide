// Javascript Document
(()=>{
  return{
    props: {
      source: {}
    },
    data(){
      return {
        menu: [
          {
            text: bbn._('Favorites'),
            items: [
              {text: bbn._('Server 1'), url: 't1'},
              {text: bbn._('Server 2 (read-only)'), url: 't2'}
            ]
          }, {
            text: bbn._('Connections'),
            items: [
              {text: bbn._('My connections'), url: 't1'},
              {text: bbn._('Public connections'), url: 't2'}
            ]
          }, {
            text: bbn._('Settings'),
            items: [
              {text: bbn._('Certificates'), url: 't1'},
              {text: bbn._('Preferences'), url: 't2'}
            ]
          }
        ],
        viewMode: 'columns', 
        connection: this.source.connection,
        currentPath: '',
        path: '',
        connected: false,
        data: [],
        host: '',
        user: '',
        pass: '',
        origin: this.source.origin,
        dirs: [{
          name: '',
          path: '',
          empty_dirs: 0,
          num_dirs: 0,
          num_files: 0,
          size: 0,
        }],
      }
    },
    mounted() {
    },
    methods: {
      updatePath(path){
        //bbn.fn.log("UPDATE PATH", path);
        this.currentPath = path;
      },
      abortRequest(a){
        alert( a)
        //bbn.fn.log(a, this.dirs)
        if ( a === 'dir' ){
          bbn.fn.abort(appui.plugins['appui-ide'] + '/finder')
          /* this.dirs.pop();*/
        }
        else{
          bbn.fn.abort(appui.plugins['appui-ide'] + '/actions/finder/file')
        }
        this.currentFile = false;
      },
      checkDisconnect(ele, oldVal){
        this.getPopup().confirm(bbn._("Are you sure you wanna disconnect?"), () => {
          this.connected = false;
        }, () => {
          if ( ele ){
            ele.$emit('input', oldVal)
          }
        })
      },
      getData(p){
        //return $.extend({
        return bbn.fn.extend({
          name: p.name,
          path: p.path
        }, this.connected ? {
          host: this.host,
          user: this.user,
          pass: this.pass
        } : {})
      },
      connect(){
        if ( this.connected ){
          this.checkDisconnect();
          return;
        }
        if ( this.host && this.user && this.pass ){
          this.post(this.source.root + 'finder2', {
            path: '',
            user: this.user,
            host: this.host,
            pass: this.pass,
            test: 1
          }, (d) => {
            bbn.fn.log('ok', d);
            if ( d.success ){
              this.connected = true;
            }
            else{
              appui.error(bbn._("Impossible to connect"))
            }
          })
        }
      },
      getPopup() {
        return this.closest('bbn-container').getPopup(...arguments);
      },
    },
  }
})();
