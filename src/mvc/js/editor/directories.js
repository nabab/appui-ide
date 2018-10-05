(() => {
  var directories;
  return{
    data(){
      return {
        tabs:[{
          url: 'repositories',
          source: {
            elements: this.source.repositories,
            root: this.source.root,
            rootTab: this.source.root + '/repositories'
          },
          icon: 'fas fa-cogs',
          color: 'red',
          title: bbn._('Repositories')
        },{
          url: 'type',
          source: {
            elements: this.source.type,
            root: this.source.root,
            rootTab: this.source.root + '/type'
          },
          icon: 'fas fa-bars',
          color: 'green',
          title: bbn._('Type')
        }]
      }
    },
    created(){
     directories = this;
    /*  let mixins = [{
        data(){
          return {
            directoriesData: directories.$data
          }
        }
      }];
      bbn.vue.setComponentRule(this.source.root + 'components/', 'appui-ide-directories');
      bbn.vue.addComponent('repositories', mixins);
    //  bbn.vue.addComponent('repository/type', mixins);
      bbn.vue.unsetComponentRule();*/
    },
    mounted(){},
    components:{}
  }
})();
