// Javascript Document
(() => {
  let fields = ['host', 'user', 'pass'];
  return {
    data(){
      return {
        formSource: {
          path: "",
          host: "",
          user: "",
          pass: "",
          text: ""
        },
        menu: [],
        connection: this.source.connection,
        path: '',
        isConnected: false,
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
    computed: {
      menuData() {
        return [
          {
            text: bbn._('Favorites'),
            items: [
              {text: bbn._('Server 1'), url: 't1'},
              {text: bbn._('Server 2 (read-only)'), url: 't2'}
            ]
          }, {
            text: bbn._('Connections'),
            items: this.source.connections.map(a => {
              a.url = this.source.root + 'finder/source/' + a.id;
              return a;
            }).concat([{
              text: bbn._('Edit connections'),
              action: () => {
                this.getPopup({
                  title: bbn._('Edit connections configuration'),
                  component: 'appui-ide-popup-connections',
                  componentOptions: {
                    source: this.source.connections
                  }
                })
              }
            }])
          }, {
            text: bbn._('Settings'),
            items: [
              {text: bbn._('Certificates'), url: 't1'},
              {text: bbn._('Preferences'), url: 't2'}
            ]
          }
        ]
      }
    },
    methods: {
      updateMenu() {
        let menu = this.getRef('menu');
        bbn.fn.log("JJRJZLJLK3", menu);
        if (menu) {
          menu.updateData();
        }
      },
      abortRequest(a){
        alert( a)
        bbn.fn.log(a, this.dirs)
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
          this.isConnected = false;
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
        }, this.isConnected ? {
          host: this.host,
          user: this.user,
          pass: this.pass
        } : {})
      },
      connect(){
        if ( this.isConnected ){
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
            bbn.fn.log(d);
            if ( d.success ){
              this.isConnected = true;
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
    beforeMount() {
      this.updateMenu();
    },
    mounted(){
      bbn.fn.log(this.menu);
    },
    watch: {
      isLoading(val){
        bbn.fn.log('isloading->>>>', val, new Date())
      },
      host(newVal, oldVal){
        if ( this.isConnected ){
          this.checkDisconnect(this.getRef('host'), oldVal)
        }
      },
      user(newVal, oldVal){
        if ( this.isConnected ){
          this.checkDisconnect(this.getRef('user'), oldVal)
        }
      },
      pass(newVal, oldVal){
        if ( this.isConnected ){
          this.checkDisconnect(this.getRef('pass'), oldVal)
        }
      },
      isConnected(){
        while ( this.numCols ){
          this.removeItem()
        }
        setTimeout(() => {
          this.add('');
        }, 250);
      },
      dirs(){
        this.$nextTick(() => {
          this.getRef('scroll').onResize(true).then(() => {
            this.$nextTick(() => {
              this.getRef('scroll').scrollEnd(true)
            });
          });
        })
      },
      currentFile(){
        this.$nextTick(() => {
          this.getRef('scroll').onResize(true);
          setTimeout(() => {
            this.getRef('scroll').scrollEnd(true)
          }, 250);
        })
      }
    },
  }
})();
