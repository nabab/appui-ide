<li>
  <div style="margin-bottom: 5px">
    <label>Code</label>
    <input class="k-textbox" readonly style="margin: 0 10px" data-bind="value: code, events: {keydown: checkEnter}"  maxlength="255">
    <label>Title/Description</label>
    <input class="k-textbox" maxlength="255" style="width:400px; margin: 0 10px" data-bind="value: text, events: {keydown: checkEnter}">
    <button class="k-button" data-bind="click: saveChild" style="margin-right: 5px">
      <i class="fa fa-save"> </i>
    </button>
    <button class="k-button" data-bind="click: removeChild">
      <i class="fa fa-trash"> </i>
    </button>
  </div>
</li>
