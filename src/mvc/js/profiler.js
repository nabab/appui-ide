// Javascript Document
(() => {
  return {
    props: ['source'],
    data(){
      let params = ''
      if ( this.source.url ){
        if ( this.source.url.substr(0, 1) === '/' ){
          this.source.url = this.source.url.substr(1);
        }
        params = '/url/view?url=%2F' + bbn.fn.replaceAll('/', '%2F', this.source.url);
      }
      return {
        param: params
      }
    }
    
  };
})();