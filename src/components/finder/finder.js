(() => {
  "use strict";

  let app;
  /**
     * Classic input with normalized appearance
     */

  let fields = ['host', 'user', 'pass'],

      filesRules = {
        pdf: 'nf nf-mdi-file_pdf bbn-red',
        php: 'nf nf-mdi-language_php bbn-blue',
        doc: 'nf nf-mdi-file_word bbn-blue',
        docx: 'nf nf-mdi-file_word bbn-blue',
        xls: 'nf nf-mdi-file_excel bbn-green',
        xlsx: 'nf nf-mdi-file_excel bbn-green',
        ppt: 'nf nf-mdi-file_powerpoint bbn-red',
        pptx: 'nf nf-mdi-file_powerpoint bbn-red',
        psd: 'nf nf-dev-photoshop bbn-blue',
        js: 'nf nf-mdi-language_javascript bbn-red',
        html: 'nf nf-mdi-language_html5 bbn-green',
        txt: 'nf nf-oct-file_text',
        css: 'nf nf-dev-css3 bbn-orange',
        less: 'nf nf-dev-css3 bbn-orange',
        zip: 'nf nf-mdi-archive bbn-orange',
        gz: 'nf nf-mdi-archive',
        gzip: 'nf nf-mdi-archive',
        png: 'nf nf-mdi-file_image bbn-purple',
        jpeg: 'nf nf-mdi-file_image bbn-blue',
        jpg: 'nf nf-mdi-file_image bbn-blue',
        gif: 'nf nf-mdi-file_image bbn-pink',
        tiff: 'nf nf-mdi-file_image bbn-brown',
        json: 'nf nf-mdi-json bbn-red'
      },
      imageExt = ['jpeg', 'png', 'jpg', 'tiff', 'gif'];

  return {
    mixins: [bbn.vue.basicComponent, bbn.vue.localStorageComponent],
    props: {
      path: {
        type: String,
        default: '.'
      },
      source: {},
      origin: {
        type: String
      },
      root: {
        type: String
      },
      preview: {
        type: Boolean,
        default: true
      },
      folderIcon: {
        type: String,
        default: 'nf nf-fa-folder bbn-yellow'
      }
    },
    data(){
      return {
        // takes the value of the path when the upload is clicked from the context menu - used to show / hide bbn-upload
        uploading: false,
        //v-model of bbn-upload
        uploaded: [],
        //defined when the button new folder/file is clicked on the bottom of the tree
        currentContextPath: '',
        isConnected: false,
        data: [],
        host: '',
        user: '',
        pass: '',
        copied: false,
        oldDir: '',
        dirs: [],
        currentFile: false,
        dirInfo: null,
        editingNode: false,
        isImage: false,
        isLoading: false,
        isText: false,
        isJson: false,
        isMarkdown: false,
        currentTitle: false,
      }
    },
    computed: {
      mapUploaded(){
        if ( this.uploaded.length ){
          return bbn.fn.map( this.uploaded, (a) => {
            a.name = a.name.replace(' ', '_')
            return a
          })
        }
        return [];
      },
      currentPath(){
        return this.dirs.map((a) => {return a.name ? a.name + '/' : '';}).join('');
      },
      numCols(){
        return this.dirs.length;
      },
      encodedURL() {
        if ( this.currentFile && this.isImage ){
          //return btoa(this.origin + this.currentPath + this.currentFile.node.data.value)
          bbn.fn.log(btoa(this.currentPath + this.currentFile.node.data.value));
          return btoa(this.currentPath + this.currentFile.node.data.value)
        }
      },
    },
    methods: {

      //abort the current request
      abortRequest(i){
        bbn.fn.happy(i)
        let loadBar = this.closest('bbn-appui').getRef('loading');
        if (loadBar) {
          let loadUrl = loadBar.currentItem.url;
          if ( bbn.fn.isNumber(i) && ( loadUrl === 'ide/finder') ){
            bbn.fn.abort(loadBar.currentItem.key);
            appui.success(bbn._('Current request aborted'))
            this.currentFile = false;
            this.dirs.splice(i, 1);
          }
          else if ( loadUrl.indexOf('ide/actions/finder/file') === 0 ){
            this.currentFile = false;
            this.isLoading = false;
            bbn.fn.abort(loadBar.currentItem.key);
          }
        }
      },
      // at click on the button of the new folder/ file on the bottom of the tree defines the property path of the current tree. Is the only way to know the current context 
      context(a, button){
        this.currentContextPath = button.closest('bbn-context').data.path;
      },
      //closes the preview of the file
      closePreview(){
        this.currentFile = false;
        this.isLoading = false;
      },
      //refresh the tree data
      refresh(name){
        let trees = this.findAll('bbn-tree');
        if ( trees.length ){
          let tree = bbn.fn.filter(trees, (a) => {
            return a.data.name === name;
          })
          if ( tree.length ){
            tree[0].reload();
          }
        }

      },
      /**
         * get the size of the current tree (the selected folder of the previous tree)
         * 
         * @param {*} p 
         */
      get_size(p){
        let idx = bbn.fn.search(this.dirs, 'name', p.name);
        this.post(this.root + 'actions/finder/dirsize', {
          path: p.path,
          origin: this.origin
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
        if ( res && res.path ){
          setTimeout( () => {
            let idx = bbn.fn.search(this.dirs, {path: res.path});
            if ( idx > -1 ){
              this.dirs[idx].num_dirs = res.num_dirs;
              this.dirs[idx].num_files = res.num_files;
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
        // Reinit
        this.isImage = false;
        this.isJson = false;
        this.isText = false;
        this.isMarkdown = false;
        this.isLoading = true;
        this.currentFile = {
          node: node
        };
        if ( node.data.value ){
          let path = '';
          let num = 2;
          if ( node.tree.data.path && (node.tree.data.path !== '.') ){
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

              //isImage
              if ( !imageExt.includes(ext) ){

                this.post( this.root + 'actions/finder/file', {
                  node: node.data,
                  path: this.currentPath,
                  origin: this.origin,
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
                    } else {
                      bbn.fn.log("File open", this.currentFile.ext);
                      switch (this.currentFile.ext) {
                        case '.md':
                          this.isMarkdown = true;
                          break;
                        case '.json':
                          this.isJson = true;
                          break;
                        case '.txt':
                          this.isText = true;
                          break;
                      }
                    }
                  }
                  else {
                    appui.error(bbn._('Something went wrong while loading the file infos'));
                  }
                  this.isLoading = false;
                });
              }
              else {
                return bbn.fn.postOut(this.root + 'actions/finder/image/' + this.encodedURL)
              }
            }
          }
        }
      },
      mapTree(node){
        bbn.fn.log("heho", node, node.text);
        let bits = node.text.split('.');
        let ext = bits[bits.length-1];
        if ( node.dir) {
          node.icon = this.folderIcon;
        }
        else if (filesRules[ext]) {
          node.icon = filesRules[ext];
        }
        return node;
      },
      getData(p){
        //return $.extend({
        return bbn.fn.extend({
          name: p.name,
          path: p.path,
          origin: this.origin
        }, this.isConnected ? {
          host: this.host,
          user: this.user,
          pass: this.pass
        } : {})
      },
      contextMenuTree(){
        return [{
          text: '<i class="nf nf-fa-file"></i>'+ bbn._('Add files to this folder'),
          action: () => {
            this.uploadFile(this.currentContextPath)
          }
        },{
          text: '<i class="nf nf-custom-folder"></i>'+ bbn._('Create new folder'),
          action: () => {
            this.newFolder()
          }
        },{
          text: '<i class="nf nf-fa-paste"></i>'+ bbn._('Paste'),
          action: (node) => {
            bbn.fn.log('context--->', arguments);
          }
        }];
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
            action: (node) => {
              this.copy(node)
            }
          }  
        ]
        if ( n.data.dir ) {
          objContext.push({
            icon: 'nf nf-fa-paste',
            text: bbn._('Create new folder'),
            action: (node) => {
              this.newFolder(node)
            }
          });
          if ( this.copied !== false ){
            objContext.push({
              icon: 'nf nf-fa-paste',
              text: bbn._('Paste'),
              action: (node) => {
                this.paste(node)
              }
            });  
          }
        }
        else{
          objContext.push({
            icon: 'nf nf-fa-download',
            text: bbn._('Download'),
            action: (node) => {
              this.download(node)
            }
          })
        }
        if ( this.closest('appui-ide-explorer').source.type === 'nextcloud' ){
          objContext.push({
            icon: 'nf nf-fa-edit',
            text: bbn._('Rename'),
            action: (node) => {
              this.edit(node)
            }
          },{
            icon: 'nf nf-fa-trash_alt',
            text: bbn._('Delete'),
            action: (node) => {
              this.delete(node)
            }
          })
        }
        return objContext;
      },
      uploadFile(path){
        this.uploading = this.currentContextPath
      },
      uploadSuccess(a, b, d){
        bbn.fn.happy('now')
        bbn.fn.log(d.data, arguments,'args')
        if ( d.data.success ){
          if ( d.data.name ){
            appui.success(bbn._(d.data.name + ' ' +'successfully uploaded'));

            if ( this.getRef('upload').filesSuccess.length && (this.getRef('upload').filesSuccess.length === this.uploaded.length) ){ 
              setTimeout(()=>{
                this.uploading = false;
                this.uploaded = [];
              }, 500)
            }
          }
        }
        else {
          appui.error(bbn._('Something went wrong while uploading the file'))
        }
      },
      newFolder(node){
        if ( node ){
          let tmp = node.tree.data.path, 
              path = '';
          if ( tmp.indexOf('/') === 0 ){
            path = tmp.substr(1, tmp.length);
          }  
          else {
            path = tmp + '/';
          }
          node.getPopup({
            title: bbn._('New Directory'),
            height: '150px',
            width: '350px',
            source: {
              treeUid: node.closest('bbn-tree')._uid,
              idx: node.idx, 
              node: node.data,
              uid: node._uid,
              origin: this.origin,
              path: path,
              root: this.root,
              new: true,
              newDir: ''
            },
            component: this.$options.components.form
          })
        }
        else { 
          if ( this.currentContextPath.length ){
            let idx = bbn.fn.search( this.findAll('bbn-tree'),  'data.path', this.currentContextPath),
                treeUid,
                tree;
            if ( idx > -1 ){
              tree = this.findAll('bbn-tree')[idx];
              treeUid = tree._uid;
              tree.getPopup({
                title: bbn._('New Directory'),
                height: '150px',
                width: '350px',
                source: {
                  treeUid: treeUid,
                  node: {
                    //just because in the case of new folder from node the value is expected in the controller
                    value: ''
                  },
                  origin: this.origin,
                  path: this.currentContextPath,
                  root: this.root,
                  new: true,
                  newDir: '', 
                  isFromTree: true
                },
                component: this.$options.components.form
              })
            }

            bbn.fn.happy(this.currentContextPath)
          }

        }

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
            this.post(this.root + 'actions/finder/paste', {
              node: this.copied.data,
              origin: this.origin,
              old_dir: this.oldDir,
              new_dir: this.currentPath
            }, (d) => {
              if ( d.success ){
                bbn.fn.happy('pasted')
                bbn.fn.log(n.tree.items)
                bbn.fn.each(trees, (v, i) => {
                  bbn.fn.log(n,( v.data.name === n.data.value ), v.data.name ,n.data.value )
                  if ( v.data.name === n.data.value ){
                    bbn.fn.log(v.source)
                    v.reload();
                  }  
                });
                appui.success(this.copied.data.value + ' ' + bbn._('successfully pasted into ' + n.data.value));
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
          this.alert(bbn._('The clipboard is empty!'));
        }
      },
      //download the file
      download(n){
        bbn.fn.postOut(this.root + 'actions/finder/download/' + n.data.value, {
          value: n.data.value,
          file: n.data.file,
          path: this.currentPath !== n.data.value + '/' ? this.currentPath : '',
          origin: this.origin,
          destination: this.origin + 'download/' + dayjs().format('x') + '/'
        })
      },
      /**
         * edits the name of the current selected node
         * @param {*} node 
         */
      edit(node){
        this.editingNode = false;
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
        node.getPopup({
          title: bbn._('Rename'),
          height: '150px',
          width: '350px',
          source: {
            treeUid: node.closest('bbn-tree')._uid,
            idx: node.idx, 
            node: node.data,
            origin: this.origin,
            path: currentPath,
            oldValue: oldValue,
            root: this.root,
          },
          component: this.$options.components.form
        })
      },
      /**
         * Deletes the current selected node
         * @param {*} node 
         */
      delete(node){
        this.confirm(bbn._('Do you want to delete') + ' ' + node.data.value + '?', () => {
          let st = node.tree.data.path,
              //st = ( (this.mode === 'ftp') || (this.mode === 'ssh')) ? this.origin + this.currentPath : this.currentPath,
              name = node.data.value;
          /*if ( node.data.dir && ( this.currentPath === '' ) ){
              st += node.data.value;
            }
            if ( node.data.file ){
              st += node.data.value;
            }
            */

          this.post(this.root + 'actions/finder/delete', {
            path: st, 
            name: name,
            origin: this.origin
          }, (d) => {
            if ( d.success ){       
              let items = node.tree.items;
              if ( items.length ){
                items.splice(node.idx, 1);
              }
              if ( node.data.dir && this.dirs.length ){
                let idx = bbn.fn.search(this.dirs, 'path', node.tree.data.path + '/' + node.data.value )
                if ( idx > -1 ){
                  this.dirs.splice(idx)
                }
              }
              //destroy the next tree in the case of elimination of a folder
              if ( node.data.dir && ( this.dirs.length > 1 ) ){
                this.dirs.pop();
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
        bbn.fn.happy('copy')
        bbn.fn.log(arguments)
        this.copied = false;
        this.confirm(bbn._('Do you want to copy') + ' ' + n.data.value + '?', () => {
          this.copied = n;
          /*if ( n.data.dir && this.dirs.length > 2){
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
            else {
              this.oldDir = this.currentPath;
            }*/
          this.oldDir = n.tree.data.path;
          let st = n.data.file ? bbn._('File') : bbn._('Folder');
          st += ' ' + bbn._('successfully copied');
          appui.success(st)
        })
      },
      updateScroll(){
        this.$nextTick(() => {
          let sc = this.getRef('scroll');
          if (sc) {
            sc.onResize().then(() => {
              setTimeout(() => {
                bbn.fn.log("IT SHOULD GO TO THE END OF THE SCROLL")
                sc.scrollEndX(true);
              }, 250);
            });
          }
        })
      }
    },
    mounted(){
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
        //bbn.fn.log('isloading->>>>', val, new Date())
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
        this.updateScroll();
      },
      currentFile(){
        this.updateScroll();
      },
      currentPath(v){
        this.$emit('change', v);
      }
    },
    components: {
      form:{
        name: 'form',
        template: `
          <bbn-form class="bbn-flex-height"
                    :source="source" 
                    @success="success" 
                    :action="source.root + 'actions/finder/' + (!source.new ? 'rename' : 'new_dir')"
                    >
            <div class="bbn-grid-fields bbn-l bbn-padded">
              <label>`+ bbn._('Name') +`</label>
              <div>
                <bbn-input v-if="!source.new" 
                           class="bbn-w-100" 
                           v-model="source.node.value"

                ></bbn-input>
                <bbn-input v-else 
                           class="bbn-w-100" 
                           v-model="source.newDir"
                >
                </bbn-input>
              </div>
            </div>
          </bbn-form>`,
        props: ['source', 'data'],
        data(){
          return {
            dirIdx: false,
          }
        },
        computed: {
          dirs(){
            return this.closest('bbn-container').getComponent().dirs;
          },
          finder(){
            return this.closest('bbn-finder')
          }
        },

        methods:{
          success(d){
            if ( d.success ){
              let trees = this.closest('bbn-container').getComponent().findAll('bbn-tree');

              //creating a new folder
              if ( d.data && d.data.new_dir ){
                bbn.fn.happy('mpod')



                let treeIdx = bbn.fn.search(trees, '_uid', this.source.treeUid);
                bbn.fn.happy(treeIdx)
                if ( ( treeIdx > -1 ) && ( trees[treeIdx + 1] ) ){
                  trees[treeIdx + 1].reload();
                  bbn.fn.happy(treeIdx)
                }
                else if (this.source.isFromTree ) {
                  //case of folder created from the context of the tree and not node
                  trees[treeIdx].reload();
                }


                appui.success(d.data.new_dir + ' ' + bbn._('successfully created'))
              }
              //editing an existing folder
              else { 
                bbn.fn.each(trees, (v, i) => {
                  if ( v._uid === this.source.treeUid ){
                    v.items[this.source.idx].value = this.source.node.value;
                    v.items[this.source.idx].text = this.source.node.value;
                  }
                })
                appui.success((this.source.node.dir ? bbn._('Folder') : bbn._('File')) + ' ' + bbn._('successfully modified'))
              }
            }
            else{
              appui.error(bbn._('Something went wrong'))
            }
          }
        },

      }
    }  
  };
})();