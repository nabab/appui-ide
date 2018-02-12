// Javascript Document
(() => {
  let logPoller = null;
  return {
    data(){
      let lignes = [
        {
          text: "10 lignes",
          value: 10
        },
        {
          text: "50 lignes",
          value: 50
        },
        {
          text: "100 lignes",
          value: 100
        },
        {
          text: "250 lignes",
          value: 250
        },
        {
          text: "500 lignes",
          value: 500
        },
        {
          text: "1000 lignes",
          value: 1000
        }
      ];
      return{
        fileLog: '',
        md5Current: '',
        autoRefreshFile: false,
        listLignes: lignes,
        lignes: lignes[1].value,
        textContent: '',
        type: "ruby",
        showText: false,
        interval: 5000,
        isPolling: false
      }
    },
    methods:{
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
            }
          }, this.interval);
        }
      }
    },
    mounted(){

      if ( !this.fileLog ){
        this.fileLog = this.files[0].value;
      }
      this.onChange();
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
              md5: a.md5
            });
          }
          return bbn.fn.order(allFiles, "text");
        }
      },
    },
    watch: {
      fileLog: function(val, old){
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