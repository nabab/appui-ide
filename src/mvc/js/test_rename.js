// Javascript Document

(() => {
  return {
    methods: {
      rename() {
        bbn.fn.post(appui.plugins['appui-newide'] + "/editor/actions/rename", {
          url: 'app/main/mvc/test-project2-ide/_end_/php',
          name: 'Hello-World',
          id_project: '8fe6e755b72611ecbc5952540000cfbe'
        }, d => {
          if (d.success) {
            appui.success(bbn._('Rename Successfully'));
          }
        });
      }
    }
  };
})();
