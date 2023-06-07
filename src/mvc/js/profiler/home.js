// Javascript Document

(()=> {
  return {
    data() {
      return {
      }
    },
    methods: {
      post_profiling() {
        bbn.fn.post(appui.plugins['appui-ide'] + '/profiler/home', {profiling: this.source.profiling}, d => {
        })
      }
    }
  };
})();