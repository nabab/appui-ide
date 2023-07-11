// Javascript Document

(() => {
  return {
    data() {
      return {
        datatree: {
        }
      };
    },
    methods: {
      formatData(fileinfo) {
        return {
          text: fileinfo.file,
          numChildren: 0,
          icon: 'nf nf-cod-file',
        };
      },
    }
  };
})();