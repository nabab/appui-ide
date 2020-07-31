(() => {
  return {
    data(){
      return {
        ideRoot: appui.plugins['appui-ide'] + '/'
      }
    },
    methods: {
      fdatetime: bbn.fn.fdatetime
    }
  }
})();