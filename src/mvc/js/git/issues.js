// Javascript Document
(() => {
  return {
    methods: {
      showUser(row){
        return row.user.username;
      },
      showTitle(row){
        return '<a href="https://gitea.bbn.so/' + row.repository + '/issues/' + row.number + '">' + row.title + '</a>';
      },
      showRepo(row){
        let tmp = row.repository.split('/');
        return tmp[tmp.length-1];
      },
      showState(row){
        return row.state === 'open' ? bbn._('Opened') : bbn._('Closed');
      },
      stateClass(row){
        let cls = 'bbn-c'
        if ( row.state === 'open' ){
          cls += ' bbn-bg-red bbn-white';
        }
        else if (row.state === 'closed') {
          cls += ' bbn-bg-green bbn-white';
        }
        else{
          cls += ' bbn-bg-grey bbn-white';
        }
        return cls
      },
      exportExcel(){
        let postData = this.getRef('table').getExcelPostData()
        postData.data = this.getRef('table').filteredData;
        this.post(appui.plugins['appui-ide'] + '/git/excel', postData, d => {
          if ( d.excel_file ){
            this.post_out(appui.plugins['appui-ide'] + '/git/excel', {excel_file: d.excel_file});
          }
        });
      }
    }
  };
})()