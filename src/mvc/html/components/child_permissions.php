<li class="bbn-flex-width" style="margin-bottom: 5px">
  <div class="bbn-block">
    <label>Code</label>
    <input class="k-textbox" readonly style="margin: 0 10px" data-bind="value: code, events: {keydown: checkEnter}"  maxlength="255">
  </div>
  <div class="bbn-block">
    <label>Title/Description</label>
  </div>
  <div class="bbn-flex-fill">
    <input class="k-textbox" maxlength="255" style="width:100%; margin: 0 10px" data-bind="value: text, events: {keydown: checkEnter}">
  </div>
  <div class="bbn-block">
    <button class="k-button" data-bind="click: saveChild" style="margin-right: 5px">
      <i class="fa fa-save"> </i>
    </button>
    <button class="k-button" data-bind="click: removeChild">
      <i class="fa fa-trash"> </i>
    </button>
  </div>
</li>