// Javascript Document
(() => {
  let logPoller = null;
  return {
    data(){
      let lignes = [10, 50, 100, 250, 500, 1000, 2000, 5000],
        themesCode =[
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
      ],
      themes= [];

      bbn.fn.each(themesCode, (v)=>{
        themes.push({
          text: v,
          value: v
        });
      });
      themes = bbn.fn.order(themes, "text");

      return{
        fileLog: '',
        md5Current: '',
        autoRefreshFile: false,
        listLignes: lignes.map((a) => {
          return {
            value: a,
            text: a + ' ' + bbn._('lines')
          }
        }),
        lignes: lignes[2],
        textContent: '',
        type: "ruby",
        showText: false,
        interval: 5000,
        isPolling: false,
        updateTree: false,
        themes:themes,
        theme: 'pastel-on-dark',
        sourceTree: []
      }
    },
    methods:{
      getSourceTreeLogs(){
        bbn.fn.post(this.source.root + 'tree_logs',{}, d => {
          if ( d.data && d.data[0].items.length ){
            d.data[0].items = bbn.fn.order(d.data[0].items, 'mtime', 'desc')
            this.sourceTree = d.data;
          }
        });
      },
      onChange(clear, e){
        if ( this.fileLog.length && this.lignes ){
          bbn.fn.post(this.source.root + 'logs', {
              log: this.fileLog,
              clear: clear ? 1 : "0",
              num_lines: this.lignes,
            },
            (d)=>{
              this.textContent = d.content;
            });
        }
      },
      selectLogFile(log){
        this.fileLog = log.text;
        this.onChange();
      },
      runInterval(){
        this.md5Current= this.files[bbn.fn.search(this.files, 'value', this.fileLog )].md5;
        if ( this.md5Current.length ){
          clearInterval(logPoller);
          logPoller = setInterval(() => {
            if ( !this.isPolling ){
              this.isPolling = true;
              bbn.fn.post(this.source.root + 'logs', {
                fileLog: this.fileLog,
                md5: this.md5Current,
                num_lines: this.lignes
              },
              (d)=>{
                this.isPolling = false;
                if ( d.change ){
                  this.textContent = d.content;
                  this.md5Current = d.md5
                }
              });
              /*bbn.fn.post(this.source.root + 'tree_logs',{}, d => {
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
        })
        //this.getRef('listFilesLog').reload();
      }
    },
    created(){
      let path = bbn.env.path;
      if ( path.indexOf(this.source.root + 'logs/') === 0 ){
        let tmp = path.substr((this.source.root + 'logs/').length);
        bbn.fn.log("PATH OK", tmp, this.files);
        if ( tmp ){
          let idx = bbn.fn.search(this.files, {text: tmp});
          if ( idx > -1 ){
            bbn.fn.log("PATH OK", tmp, this.files);
            this.fileLog = this.files[idx].value;
          }
        }
      }
      if ( !this.fileLog ){
        this.fileLog = this.files[0].value;
      }
    },
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
        if ( this.source.logs.length ){
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
      }
    },
    watch: {
      fileLog: function(val, old){
        this.closest("bbn-router").route(this.source.root + 'logs/' + val.toString());
        if ( val && !this.showText ){
          this.showText = true
        }
        if ( (val !== old) && (this.autoRefreshFile) ){
          this.md5Current = "";
          this.autoRefreshFile= false;
        }
      },
      lignes: function(val, old){
        if ( val && !this.showText ){
          this.showText = true
        }
      },
      showText: function(val, oldVal){
        if ( val ){
          this.onChange();
          this.showText = false
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
  }
})();
