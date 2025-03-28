// Javascript Document
(() => {
  let logPoller = null;
  return {
    mixins: [bbn.cp.mixins.basic],
    data(){
      let lignes     = [10, 25, 50, 100, 150, 250, 500, 1000, 2000, 5000];
      let themes     = [];
      let themesCode = [
        '3024-day',
        '3024-night',
        'abcdef',
        'ambiance',
        'base16-dark',
        'base16-light',
        'bespin',
        'blackboard',
        'cobalt',
        'colorforth',
        'dracula',
        'duotone-dark',
        'duotone-light',
        'eclipse',
        'elegant',
        'erlang-dark',
        'hopscotch',
        'icecoder',
        'isotope',
        'lesser-dark',
        'liquibyte',
        'material',
        'mbo',
        'mdn-like',
        'midnight',
        'monokai',
        'neat',
        'neo',
        'night',
        'panda-syntax',
        'paraiso-dark',
        'paraiso-light',
        'pastel-on-dark',
        'railscasts',
        'rubyblue',
        'seti',
        'solarized dark',
        'solarized light',
        'the-matrix',
        'tomorrow-night-bright',
        'tomorrow-night-eighties',
        'ttcn',
        'twilight',
        'vibrant-ink',
        'xq-dark',
        'xq-light',
        'yeti',
        'zenburn'
      ];
      bbn.fn.each(themesCode, (v)=>{
        themes.push({
          text: v,
          value: v
        });
      });
      themes = bbn.fn.order(themes, "text");

      return {
        fileLog: '',
        md5Current: '',
        autoRefreshFile: false,
        listLignes: lignes.map((a) => {
          return {
            value: a,
            text: a + ' ' + bbn._('lines')
          };
        }),
        lignes: lignes[2],
        text: '',
        type: "js",
        showText: false,
        interval: 5000,
        isPolling: false,
        updateTree: false,
        themes:themes,
        theme: 'pastel-on-dark',
        sourceTree: [],
        root: appui.plugins['appui-ide'] + '/',
      };
    },
    methods:{
      treeClass(data, tree, parent) {
        //bbn.fn.log(["TREE CLASS" , data, tree, parent]);
        return parent.isRoot? 'bbn-xl bbn-capital' : '';
      },
      getSourceTreeLogs(){
        this.post(this.root + 'tree_logs',{}, d => {
          if ( d.data && d.data[0].items.length ){
            bbn.fn.each(d.data[0].items, (v, i)=>{
              if ( v.size !== undefined ){
                d.data[0].items[i].text = '<span title="' +
                  bbn._('Modified:') + ' ' + v.title +'">' +
                  d.data[0].items[i].text +
                  '</span> <span class="bbn-i bbn-light">' +
                  bbn.fn.formatBytes(v.size) + '</span>';
              }
            });
            d.data[0].items = bbn.fn.order(d.data[0].items, 'mtime', 'desc');
            this.sourceTree = d.data;
          }
        });
      },
      onChange(clear, e){
        bbn.fn.log("onChange", this.fileLog, this.lignes);
        if ( this.fileLog.length && this.lignes ){
          this.post(this.root + 'logs/' + this.fileLog, {
              log: this.fileLog,
              clear: clear ? 1 : "0",
              num_lines: this.lignes,
            },
            d => {
              bbn.fn.log("onChange2", d);
              this.text = d.content;
            	this.$nextTick(() => {
                let code = this.getRef('code');
                if (code?.scrollBottom) {
                  code.scrollBottom();
                }
              });
            });
        }
      },
      deleteFile(){
        this.confirm(bbn._('Are you sure you want to delete the file:') + ' ' + this.fileLog , () => {
          this.post(this.root + 'logs', {
            delete_file: this.fileLog,
          },
          d => {
            if ( d.success ){
              let path = bbn.env.path;
              if ( path.indexOf(this.root + 'logs/') === 0 ){
                let tmp = path.substring((this.root + 'logs/').length);
                if ( tmp ){
                  let idx = bbn.fn.search(this.files, {text: tmp});
                  if ( idx > -1 ){
                    this.fileLog = this.files[idx].value;
                  }
                }
              }
              if ( !this.fileLog ){
                this.fileLog = this.files[0].value;
              }
              this.onChange();
              this.getSourceTreeLogs();
              this.setFileLog();
            }
          });
        });
      },
      selectLogFile(log){
        this.fileLog = log.data.fileName;
       // this.onChange();
      },
      runInterval(){
        let current = bbn.fn.getRow(this.files, {value: this.fileLog});
        this.md5Current = current ? current.md5 : '';
        if ( this.md5Current.length ){
          clearInterval(logPoller);
          logPoller = setInterval(() => {

            if ( !this.isPolling ){
              this.isPolling = true;

              this.post(this.root + 'logs', {
                fileLog: this.fileLog,
                md5: this.md5Current,
                num_lines: this.lignes
              },
              (d)=>{
                this.isPolling = false;
                if ( d.change ){
                  this.text = d.content;
                  this.md5Current = d.md5;
                  let code = this.getRef('code');
                  this.$nextTick(()=>{
                    if ( code !== undefined ){
                      code.widget.setCursor( code.widget.lastLine() , 0);
                    }
                  });
                }
              });
              /*this.post(this.root + 'tree_logs',{}, d => {
                if ( d.data && d.data[0].items.length ){
                  d.data[0].items = bbn.fn.order(d.data[0].items, 'mtime', 'desc')
                  let newData = d.data[0].items.map((item)=>{
                    return item['text'];
                  });

                  let oldData = this.sourceTree[0].items.map((item)=>{
                    return item['text'];
                  });

                  bbn.fn.log("www",newData, oldData, newData == oldData);
                  if ( newData !== oldData){
                    this.sourceTree = [];
                    this.$nextTick(()=>{
                      this.sourceTree = d.data;
                    });
                  }
                }
              });*/

            }
          }, this.interval);
        }
      },
      treeReload(){
        this.sourceTree = [];
        this.$nextTick(()=>{
          this.getSourceTreeLogs();
        });
        //this.getRef('listFilesLog').reload();
      },
      setFileLog(){
        if ( (this.source.file_url !== undefined) &&
          (bbn.fn.search(this.sourceTree[0].items, 'fileName', this.source.file_url) !== -1)
        ){
          this.fileLog = this.source.file_url;
        }
        else{
          this.fileLog = this.sourceTree[0].items[0].fileName;
        }
      }
    },
    /*created(){
      let path = bbn.env.path;
      if ( path.indexOf(this.root + 'logs') === 0 ){
        let tmp = path.substring((this.root + 'logs').length+1);
        bbn.fn.log("sswwssw", tmp);
        if ( tmp ){
          let idx = bbn.fn.search(this.files, {text: tmp});
          if ( idx > -1 ){
            this.fileLog = this.files[idx].value;
            this.onChange();
            //this.closest("bbn-router").route(this.root + 'logs/' + val.toString());
          }
        }
      }
      if ( !this.fileLog ){
        this.fileLog = this.sourceTree[0]['items'][0].fileName
        //this.fileLog = this.files[0].value;
      }
    },*/
    mounted(){
      this.onChange();
      this.getSourceTreeLogs();
    },
    beforeDestroy(){
      clearInterval(bbn.var.logPoller);
      bbn.var.logPoller = false;
    },
    computed:{
      files(){
        if ( this.source?.logs?.length ){
          let allFiles = [];
          for( let a of this.source.logs ){
            allFiles.push({
              value: a.text,
              text: a.text,
              md5: a.md5,
              mtime: a.mtime
            });
          }
          return bbn.fn.order(allFiles, "text");
        }

        return [];
      }
    },
    watch: {
      fileLog(val, old){
        const router = this.closest("bbn-router");
        if (router) {
          router.route(this.root + 'logs/' + val.toString());
        }

        if ( val && !this.showText ){
          this.showText = true;
        }
        if ( (val !== old) && (this.autoRefreshFile) ){
          this.md5Current = "";
          this.autoRefreshFile= false;
        }
      },
      lignes: function(val, old){
        if ( val && !this.showText ){
          this.showText = true;
        }
      },
      showText: function(val, oldVal){
        if ( val ){
          this.onChange();
          this.showText = false;
        }
      },
      autoRefreshFile: function(newVal){
        if ( newVal ){
          this.runInterval();
        }
        else{
          clearInterval(logPoller);
          logPoller = false;
        }
      }
    }
  };
})();