// Javascript Document
(() => {
  return {
    data(){
      return {
        froot: 'app',
        menu: [
          {text: bbn._('Application'), value: 'app'},
          {text: bbn._('PHP libraries'), value: 'lib'},
        	{text: bbn._('Javascript libraries'), value: 'cdn'}
        ],
        root: bbn.env.plugins['appui-ide'],
        currentNode: '',
        selectedNode: false,
        isFile: false, 
        fileContent: '',
        extension: '',
        initialContent: ''
      }
    },
    computed: {
      componentTag() {
        if (this.extension) {
          let ext = this.extension.toLowerCase();
          switch (ext) {
            case 'md':
              return 'bbn-markdown';
            case 'json':
              return 'bbn-json-editor';
            default:
              return 'bbn-code';
          }
        }
        return 'div';
      },
      componentOptions() {
        if (this.extension) {
          let ext = this.extension.toLowerCase();
          switch (ext) {
            case 'php':
              return {mode: 'php'};
            case 'js':
              return {mode: 'js'};
            case 'html':
              return {mode: 'html'};
            case 'css':
              return {mode: 'css'};
            case 'less':
              return {mode: 'less'};
          }
        }
        return {};
      }
    },
    methods: {
      beforeLoad(a){
        this.currentNode = a.item;
      },
      unselect(){
        this.selectedNode = {};
      },
      ready(){
        this.initialContent = this.fileContent
      }, 
      select(a){
        this.isFile = false;
        this.$nextTick(() => {
          this.selectedNode = a.data;
          this.isFile = a.data.file;
          if ( this.isFile ){
            this.post(this.root + '/actions/files/get_content', a.data,(d) => {
              if ( d.success ){
                if( this.fileContent !== this.initialContent ){
                  this.alert(bbn._('Be sure to save changes on file'))
                }
                this.fileContent = d.content;
                this.extension = d.extension;
                this.initialContent = d.content;
              }
            })
          }
        })

      },
      cancel(){
        this.fileContent = this.initialContent;
      },
      save(){
        if (this.isFile){
          if(this.initialContent !== this.fileContent){
            this.post(this.root + '/actions/files/save', {
              node: this.selectedNode,
              content: this.fileContent
            }, (d) => {
              if(d.success){
                this.initialContent = this.fileContent;
                appui.success(bbn._('Saved'))
              }
              else{
                appui.error(bbn._('Something went wrong'))
              }
            })
          }
        }
        else {
          this.alert(bbn._('You have not changes to save'))
        }
      },
      mapper(a) {
        return {
          num: a.num,
          text: a.name,
          fpath: this.froot,
          file: a.file,
          item: (this.currentNode ? this.currentNode + '/' : '') + a.name
        }
      }
    },
    watch: {
      froot(){
        this.getRef('tree').reload();
      }

    },
  }
})();