<form method="post">
  <input type="hidden" name="type" data-bind="value: type">
  <input type="hidden" name="dir" data-bind="value: dir">
  <input type="hidden" name="path" data-bind="value: path">
  <label for="ide_new_name" class="appui-form-label">Name</label>
  <input type="text" name="name" class="appui-form-field k-textbox" id="ide_new_name" required="required" data-bind="value: name">
  <div class="appui-form-label"></div>
  <div class="appui-form-field" style="text-align: right">
    <button class="k-button" type="submit">
      <i class="fa fa-edit"></i> Rename
    </button>
    <button class="k-button" type="button" onclick="bbn.fn.closePopup();">
      <i class="fa fa-close"></i> Cancel
    </button>
  </div>
</form>
