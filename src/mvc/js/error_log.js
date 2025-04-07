// Javascript Document
(() => {
  return {
    methods: {
      backtrace(row){
        if (row.backtrace) {
          this.getPopup({
            label: bbn._('Backtrace') + ' ' + bbn.fn.fdate(row.last_date, true),
            width: '80%',
            height: '80%',
            component: {
              props: ['source'],
              template: `
<div class="bbn-overlay bbn-flex-height">
	<div class="bbn-padded">
    <span v-text="source.error" class="bbn-b bbn-m"></span><br>
    <span v-text="source.file" class="bbn-i bbn-m"></span>
	</div>
	<div class="bbn-flex-fill">
    <bbn-table :source="source.backtrace" :scrollable="true">
      <bbns-column field="function" :render="showFn"></bbns-column>
      <bbns-column field="file"></bbns-column>
      <bbns-column field="line" :width="80" cls="bbn-b"></bbns-column>
    </bbn-table>
	</div>
</div>`,
              methods: {
                showFn(row) {
                  let st = '';
                  if (row.class) {
                    st += row.class;
                  }
                  if (row.type) {
                    st += row.type;
                  }
                  if (row.function) {
                    st += row.function + '(';
                    if (row.args && row.args.length) {
                      st += '<br>';
                      bbn.fn.each(row.args, (a) => {
                        st += '&nbsp;&nbsp;';
                        if (bbn.fn.isString(a)) {
                          st += a;
                        }
                        else if (a === null){
                          st += 'NULL';
                        }
                        else if (a === false){
                          st += 'FALSE';
                        }
                        else if (a === true){
                          st += 'TRUE';
                        }
                        else if (a === 0){
                          st += '0';
                        }
                        else if (a.toString) {
                          st += a.toString;
                        }
                        st += '<br>';
                      });
                    }
                    st += ')'
                  }
                  return st;
                }
                
              }
            },
            source: row
          })
        }
      },
    }
  };
})()
