// Javascript Document

(() => {
  // ele is the tab container
  // data is the data returned by the model
  return (ele, data) => {
    // This will be executed after the content is loaded
    let state = false;
    let interval = setInterval(() => {
      state = !state;
      let container = ele.querySelector(".example-receiver");
      if (!container) {
        clearInterval(interval);
        return;
      }
      container.innerHTML = state ? data.myTitle : '&nbsp;';
    }, 100);
  };
})();
