// Javascript Document

(() => {
  return {
    data() {
      return {
        myCode: this.source.content,
        myTheme: "basicDark",
        myMode: this.source.ext
      };
    }
  };
})();