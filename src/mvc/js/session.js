// Javascript Document
(() => {
  return {
    props: ['source'],
    data(){
      return {
        type: false,
        items: []
      }
    },
    watch: {
      type(newVal) {
        if (newVal) {
          if (this.items.length) {
            this.items.splice(0, this.items.length);
          }

          this.post(appui.plugins['appui-ide'] + '/session', {
            type: newVal
          }, d => {
            if (d.data) {
              this.items.push(...d.data);
              this.$nextTick(() => {
                this.getRef('tree').updateData()
              })
            }
          })
        }
    	}
    }
  };
})();