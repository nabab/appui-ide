<div class="k-block" style="height: 100%">
  <div class="k-header bbn-c">Permissions settings</div>
  <div class="perm_set" style="padding: 10px">
    <input type="hidden" data-bind="value: id">
    <div>
      <label>Code</label>
      <input class="k-textbox" readonly style="margin: 0 10px" data-bind="value: code">
      <label>Title/Description</label>
      <input class="k-textbox" maxlength="255" style="width:400px; margin: 0 10px" data-bind="value: text, events: {keydown: checkEnter}">
      <button class="k-button" data-bind="click: save">
        <i class="fa fa-save"> </i>
      </button><br>

      <label style="margin-top: 5px">Help</label>
      <textarea class="k-textbox" style="margin: 5px 10px 0 10px; width: 90%" data-bind="value: help"></textarea>
    </div>

    <div class="k-block" style="margin-top: 10px">
      <div class="k-header bbn-c">Children permissions</div>
      <div style="padding: 10px">
        <div>
          <label>Code</label>
          <input class="k-textbox" style="margin: 0 10px" maxlength="255">
          <label>Title/Description</label>
          <input class="k-textbox" maxlength="255" style="width:400px; margin: 0 10px" data-bind="events: {keydown: checkEnter}">
          <button class="k-button" data-bind="click: add">
            <i class="fa fa-plus"> </i>
          </button>
        </div>
        <ul style="list-style: none; padding: 0" data-template="ide_child_permissions_form_template" data-bind="source: children"></ul>
      </div>
    </div>
  </div>
</div>