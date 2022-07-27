// Javascript Document

(() => {
  // This is an anonymous component which a sole property: source
  return {
    data(){
      return {
        myText: 'I come from the Vue object',
        countries: this.source.countries.map(a => a.country)
      }
    }
  };
})();
