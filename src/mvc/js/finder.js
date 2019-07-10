// Javascript Document
(() => {
  let fields = ['host', 'user', 'pass'];
  return {
    props: {
      path: {
        type: String,
        default: ''
      },
      source: {}
    },
    data(){
      return {
        isConnected: false,
        data: [],
        host: '',
        user: '',
        pass: '',
        origin: this.source.origin,
        copied: false,
        oldDir: '',
        dirs: [{
          name: '',
          path: '',
          empty_dirs: 0,
          num_dirs: 0,
          num_files: 0,
          size: 0,
        
        }],
        currentFile: false,
        dirInfo: null,
        editingNode: false,
        isImage: false,
        isLoading: false,
        currentTitle: false,
      }
    },
    computed: {
      
      currentPath(){
        return this.dirs.map((a) => {return a.name ? a.name + '/' : '';}).join('');
      },
    	numCols(){
        return this.dirs.length;
      },
      encodedURL() {
        if ( this.currentFile && this.isImage ){
          return btoa(this.source.origin + this.currentPath + this.currentFile.node.data.value)
        }
      },
	  },
    methods: {
      /**
       * get the size of the current tree (the selected folder of the previous tree)
       * 
       * @param {*} p 
       */
      get_size(p){
        let idx = bbn.fn.search(this.dirs, 'name', p.name);
        bbn.fn.post(this.source.root + 'actions/finder2/dirsize', {
          path: p.path,
          origin: this.source.origin
        }, (d) => {
            if ( d.success ){
              this.dirs[idx].size = d.size;
            }
            else { 
              appui.error(bbn._('Something went wrong'));
            }
          });
      },
      add(path){
        let fpath = path;
        if ( this.dirs.length > 1 ){
          fpath = this.currentPath + path;
        }
        this.dirs.push({
          name: path,
          path: fpath,
          empty_dirs: 0,
          num_dirs: 0,
          size: 0
        });
      },
      remove(){
        this.dirs.pop();
      },
      
      /**
       * method at @load of bbn - rtee
       * 
       * @param {*} res 
       */
      updateInfo(res){
        if ( res.info_dir && res.path ){
          setTimeout(() => {
            let idx = bbn.fn.search(this.dirs, {path: res.path});
            if ( idx > -1 ){
              this.dirs[idx].num_dirs = res.info_dir.num_dirs;
              this.dirs[idx].num_files = res.info_dir.num_files;
              this.isLoading = false;
            }
          }, 300)
        }
      },
      
      /**
       * method at @select of bbn - tree, defines currentFile and makes the post to take the infos of the file
       * 
       * @param {*} node 
       */
      select(node){
        this.isImage = false;
        this.isLoading = true;
        this.currentFile = {
          node: node
        };
       
        bbn.fn.log('IS LOADING', this.isLoading, this.currentFile)
        if ( node.data.value ){
          let path = '';
          let num = 2;
          if ( node.tree.data.path ){
            path += node.tree.data.path;
            num += path.split('/').length;
          }
          path += node.data.value;
          if ( this.currentPath !== path ){
            while ( num <= this.numCols ){
              this.remove();
            }
            if ( node.data.dir ){
              this.currentFile = false;
              this.dirInfo = node.data;
              this.add(node.data.value);
            }
            else if ( node.data.file ){
              let idx = node.data.value.lastIndexOf('.'), 
                  ext = '';
              if ( idx > -1 ){
                let val = node.data.value.length - idx;
                ext = node.data.value.slice(- val);
              }
              
              bbn.fn.post(this.source.root + 'actions/finder2/file', {
                node: node.data,
                path: this.currentPath,
                origin: this.source.origin,
                ext: ext, 
                width: 450,
                height: 300,
              }, (d) => {
                if ( d.success && d.info ) {
                  this.currentFile = {
                    node: node,
                    height: d.info.height ? d.info.height : '',
                    width: d.info.width ? d.info.width : '',
                    info: d.info,
                    ext: ext, 
                  }
                 
                  if ( d.info.is_image ){
                    this.isImage = true;
                  }
                  bbn.fn.log('IS LOADING', this.isLoading)
                }
                else {
                  appui.error(bbn._('Something went wrong while loading the file infos'));
                }
                this.isLoading = false;
              })
            }
          }
        }
      },
      abortRequest(a){
        alert( a)
        bbn.fn.log(a, this.dirs)
        if ( a === 'dir' ){
          bbn.fn.abort('ide/finder')
          /* this.dirs.pop();*/
        }
        else{
          bbn.fn.abort('ide/actions/finder2/file')
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
        } : {});
      },
      connect(){
        if ( this.isConnected ){
          this.checkDisconnect();
          return;
        }
        if ( this.host && this.user && this.pass ){
          bbn.fn.post(this.source.root + 'finder', {
            path: '',
            user: this.user,
            host: this.host,
            pass: this.pass,
            test: 1
          }, (d) => {
            if ( d.success ){
              this.isConnected = true;
            }
            else{
              appui.error(bbn._("Impossible to connect"))
            }
          })
        }
      },
      /**
       * returns the array of buttons of the context menu
       * 
       * @param {*} n the node 
       * @param {*} i the index of the node
       * @return array
       */
      itemsContextMenu(n, i) {
        let objContext = [
          {
            icon: 'nf nf-fa-copy',
            text: bbn._('Copy'),
            command: (node) => {
              this.copy(node)
            }
          },{
            icon: 'nf nf-fa-edit',
            text: bbn._('Modify'),
            command: (node) => {
              this.edit(node)
            }
          },{
            icon: 'nf nf-fa-trash_alt',
            text: bbn._('Delete'),
            command: (node) => {
              this.delete(node)
            }
          },  
        ]
        if ( n.data.dir && (this.copied !== false) ) {
          objContext.push({
            icon: 'nf nf-fa-paste',
            text: bbn._('Paste'),
            command: (node) => {
              this.paste(node)
            }
          });
        }
        return objContext;
      },
      finderContextMenu(n, i) {
        let objContext = [{
          icon: 'nf nf-fa-paste',
          text: bbn._('Paste'),
          command: (node) => {
            this.paste_context(node)
          }
        }];
         // return objContext;
        return [];
      },
      paste_context(){
        bbn.fn.log('context--->',arguments)
      },
      /**
       * paste the node previously copied in the property this.copied in the current selected dir
       * 
       * @param {*} n the node
       */
      paste(n){
        n.isSelected = true;
        bbn.fn.log('PASTE', n, typeof(n))
        //case of paste called from context menu and not from nodes of the tree
        let value = '';
        if ( typeof(n) === 'string' ){
          value = bbn._('the current folder');  
        }
        else {
          value = n.data.value;
        }
        if ( (typeof(n) === 'string' || n.data.dir ) && this.copied ) {
           let st = bbn._('Do you want to paste') + ' ' + this.copied.data.value + ' ' + bbn._('into') + ' ' + value + '?';
          let trees = this.findAll('bbn-tree'), 
          path = '';
          this.confirm(bbn._(st), () => {
            bbn.fn.post(this.source.root + 'actions/finder2/paste', {
              node: this.copied.data,
              origin: this.source.origin,
              old_dir: this.oldDir,
              new_dir: this.currentPath
            }, (d) => {
              if ( d.success ){
                bbn.fn.each(trees, (v, i) => {
                  if ( v.data.name === n.data.value ){
                    v.reload();
                  }  
                });
                appui.success(this.copied.data.value + ' ' + bbn._('successfully pasted into' + n.data.value));
              }
              else{
                appui.error(bbn._('Something went wrong'));
              }
              this.copied = false;
              this.oldDir = '';
            })
          });
        }
        else if ( !this.copied ){
          this.alert(bbn._('Copy something before to paste'));
        }
      },
      /**
       * edit the name of the current selected node
       * @param {*} node 
       */
      edit(node){
				this.editingNode = false;
        node.isSelected = true;
        let oldValue = node.data.value,
          tmp = node.closest('bbn-tree').data.path,
          path = '';

        if ( tmp.indexOf('/') === 0 ){
          path = tmp.substr(1, tmp.length);
        }  
        else {
          path = tmp + '/';
        }
        let currentPath = path;
        
        this.editingNode = node;
        node.getPopup().open({
          title: bbn._('Modify'),
          height: '150px',
          width: '350px',
          source: {
            treeUid: node.closest('bbn-tree')._uid,
            idx: node.idx, 
            node: node.data,
            origin: this.source.origin,
            path: currentPath,
            oldValue: oldValue,
            root: this.source.root,
          },
          component: this.$options.components.form
        })
      },
      /**
       * Deletes the current selected node
       * @param {*} node 
       */
      delete(node){
        node.isSelected = true;
        this.confirm(bbn._('Do you want to delete') + ' ' + node.data.value + '?', () => {
          let st = this.source.origin + this.currentPath,
              name = node.data.value;
          if ( node.data.file ){
            st += node.data.value;
          }
          
          bbn.fn.post(this.source.root + 'actions/finder2/delete', {
            path: st
          }, (d) => {
            if ( d.success ){        
              node.closest('bbn-tree').reload();
              if ( node.data.dir ){
                let idx = bbn.fn.search(this.dirs, 'name', name)
                this.dirs.splice(this.dirs.length - idx +1, idx);
							}
              appui.success(name + ' ' + bbn._('successfully deleted'));
              this.currentFile = false;
            }
            else {
              appui.error(bbn._('Something went wrong while deleting' + node.data.value));
            }
          })
        });
      },
      dragStart(){
        bbn.fn.log('START', arguments)
      },
      dragEnd(){
        bbn.fn.log('END', arguments)
      },
      /**
       * Insert the current selected node in the property this.copied 
       * @param n the node
       */
      copy(n){
        n.isSelected = true;
        this.copied = false;
        this.confirm(bbn._('Do you want to copy') + ' ' + n.data.value + '?', () => {
          this.copied = n;
          if ( n.data.dir && this.dirs.length > 2){
            let st = this.currentPath.slice(0,-1),
            idx = st.lastIndexOf('/');
            if ( idx > -1 ){
              st = st.substring(0, idx);
            }
            this.oldDir = st + '/';
          }
          else if ( n.data.dir && this.dirs.length <= 2 ){
            this.oldDir = '';
          }
          else{
            this.oldDir = this.currentPath;
          }
          let st = n.data.file ? bbn._('File') : bbn._('Folder');
          st += ' ' + bbn._('successfully copied');
          appui.success(st)
        })
      }
    },
    mounted(){
      alert(bbn._('test nuova stringa in ide'))
      if ( this.path ){
        bbn.fn.each(this.path.split('/'), (a) => {
          if ( a ){
            this.add(a)
          }
        });
      }
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
          this.remove()
        }
        setTimeout(() => {
          this.add('');
        }, 250);
      },
      dirs(){
        this.$nextTick(() => {
          this.getRef('scroll').onResize(true);
          this.$nextTick(() => {
            this.getRef('scroll').scrollEnd(true)
          })
        })
      },
      currentFile(){
        this.$nextTick(() => {
          this.getRef('scroll').onResize(true);
          this.$nextTick(() => {
            this.getRef('scroll').scrollEnd(true)
          })
        })
      }
    },
    components: {
      form:{
        name: 'form',
        template: '#form',
        data(){
          return {
            dirIdx: false,
          }
        },
        computed: {
          dirs(){
            return this.closest('bbn-container').getComponent().dirs;
          }
        },
        props: ['source', 'data'],
				methods:{
					success(d){
						if ( d.success ){
              let trees = this.closest('bbn-container').getComponent().findAll('bbn-tree');
              bbn.fn.each(trees, (v, i) => {
                if ( v._uid === this.source.treeUid ){
                  this.dirIdx = bbn.fn.search(this.dirs, 'path', v.data.path.trim());
                  v.items[this.source.idx].value = this.source.node.value;
                  v.items[this.source.idx].text = this.source.node.value;
                }
              })
              bbn.fn.each(this.dirs, (d, i) => {
                if ( i > this.dirIdx ){
                  if ( d.path.indexOf(this.source.oldValue) > -1 ){
                    d.path = d.path.replace(this.source.oldValue, this.source.node.value);
                  }
                  if ( d.name.indexOf(this.source.oldValue) > -1 ) {
                    d.name = this.source.node.value;
                  }
                }
              });
							appui.success((this.source.node.dir ? bbn._('Folder') : bbn._('File')) + bbn._('successfully modified'))
						}
						else{
							appui.error(bbn._('Something went wrong'))
						}
					}
					
				}
      }
    }  
  }
})();