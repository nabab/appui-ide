// Javascript Document

(() => {
  return {
    data() {
      return {
        myCode: this.source.content,
        themes: [
          "basicLight",
          "basicDark",
          "gruvboxDark",
          "gruvboxLight",
          "materialDark",
          "nordTheme",
          "solarizedDark",
          "solarizedLight"
        ],
        myTheme: "basicDark",
        myMode: this.source.ext
      }
    }
  }
})();