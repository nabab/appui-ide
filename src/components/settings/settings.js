(() => {
  return {
    props: ['source'],
    data(){
      return {
        titles:{
          permissions: bbn._('Permissions'),
          subPerm: bbn._('Sub-permissions') + '  (' + this.source.permissions.children.length +')',
          help: bbn._('Help'),
          messages: bbn._('Messages')
        }
      }
    }    
  }
})();
