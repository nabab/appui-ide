<ul class="bbn-ide-context"></ul>
<div class="bbn-ide-container bbn-h-100">
  <div class="pane-content bbn-ide"></div>
  <div class="pane-content bbn-code-container">
    <div class="pane-content tree"></div>
    <div class="pane-content" style="padding: 0">
      <div style="position: absolute; top: auto; left: auto; margin: 50%; text-align: center">
        Tool's description comes here
      </div>
      <div id="tabstrip_editor" v-bbn-fill-height></div>
    </div>
    <div class="pane-content">
      <iframe class="bbn-full-screen" src="https://doc.mybbn.so"></iframe>
    </div>
  </div>
</div>

<script type="text/x-kendo-template" id="ide_new_template">
  <form method="post" autocomplete="off">
    <input type="hidden" name="type">
    <input type="hidden" name="dir">
    <div class="bbn-form-label">Name</div>
    <div class="bbn-form-field">
      <input type="text" name="name" class="k-textbox" required="required">
    </div>
    <div class="bbn-form-label">Path</div>
    <div class="bbn-form-field">
      <input type="text" name="path" class="k-textbox" readonly="readonly" required>
      <button class="k-button" onclick="bbn.ide.selectDir(); return false;">Browse</button>
      <button class="k-button" onclick="$(this).prevAll('input').val('./'); return false;">Root</button>
    </div>
    <div class="bbn-form-label"></div>
    <div class="bbn-form-field" style="text-align: right">
      <button class="k-button" type="submit">
        <i class="fa fa-check"> </i> Save
      </button>
      <button class="k-button" type="button" onclick="bbn.fn.closePopup();">
        <i class="fas fa-times"> </i> Cancel
      </button>
    </div>
  </form>
</script>


<script type="text/x-kendo-template" id="ide_rename_template">
  <form method="post">
    <input type="hidden" name="type" data-bind="value: type">
    <input type="hidden" name="dir" data-bind="value: dir">
    <input type="hidden" name="path" data-bind="value: path">
    <label for="ide_new_name" class="bbn-form-label">Name</label>
    <input type="text" name="name" class="bbn-form-field k-textbox" id="ide_new_name" required="required" data-bind="value: name">
    <div class="bbn-form-label"></div>
    <div class="bbn-form-field" style="text-align: right">
      <button class="k-button" type="submit">
        <i class="fa fa-edit"></i> Rename
      </button>
      <button class="k-button" type="button" onclick="bbn.fn.closePopup();">
        <i class="fas fa-times"></i> Cancel
      </button>
    </div>
  </form>
</script>

<script type="text/x-kendo-template" id="ide_manage_directories_template">
  <div id="ide_manage_dirs" class="bbn-full-height">
    <div id="ide_manage_dirs_grid" class="bbn-full-height"></div>
  </div>
</script>

<script type="text/x-kendo-template" id="ide_appearance_template">
  <div class="bbn-full-height" style="padding-top: 10px">
    <form>
      Theme: <input id="ide_theme_sel" name="theme">
      Font: <input id="ide_font_sel" name="font">
      Size: <input id="ide_font_size_sel" name="font_size">
      <br><br>
      <textarea id="code" style="width: 100%; height: 300px">
function findSequence(goal) {
  function find(start, history) {
    if (start == goal)
      return history;
    else if (start > goal)
      return null;
    else
      return find(start + 5, "(" + history + " + 5)") ||
             find(start * 3, "(" + history + " * 3)");
  }
  return find(1, "1");
}</textarea>
      <br><br>
      <div align="right">
        <button class="k-button" type="button" onclick="bbn.fn.closePopup();"><i class="fas fa-times"></i> Annule
        </button>
        <button class="k-button" type="button"><i class="fa fa-save"></i> Sauver</button>
      </div>
    </form>
  </div>
</script>

<script type="text/x-kendo-template" id="ide_permissions_form_template">
  <div class="k-block" style="height: 100%">
    <div class="k-header bbn-c">Permissions setting</div>
      <div class="perm_set" style="padding: 10px">
        <input type="hidden" data-bind="value: perm_id">
        <div>
          <label>Code</label>
          <input class="k-textbox" readonly style="margin: 0 10px" data-bind="value: perm_code">
          <label>Title/Description</label>
          <input class="k-textbox" maxlength="255" style="width:400px; margin: 0 10px" data-bind="value: perm_text, events: {keydown: checkEnter}">
          <button class="k-button" data-bind="click: save">
            <i class="fa fa-save"> </i>
          </button><br>

          <label style="margin-top: 5px">Help</label>
          <textarea class="k-textbox" style="margin: 5px 10px 0 10px; width: 90%" data-bind="value: perm_help"></textarea>
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
            <ul style="list-style: none; padding: 0" data-template="ide_child_permissions_form_template" data-bind="source: perm_children"></ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</script>

<script type="text/x-kendo-template" id="ide_child_permissions_form_template">
  <li>
    <div style="margin-bottom: 5px">
      <label>Code</label>
      <input class="k-textbox" readonly style="margin: 0 10px" data-bind="value: perm_code, events: {keydown: checkEnter}"  maxlength="255">
      <label>Title/Description</label>
      <input class="k-textbox" maxlength="255" style="width:400px; margin: 0 10px" data-bind="value: perm_text, events: {keydown: checkEnter}">
      <button class="k-button" data-bind="click: saveChild" style="margin-right: 5px">
        <i class="fa fa-save"> </i>
      </button>
      <button class="k-button" data-bind="click: removeChild">
        <i class="fa fa-trash"> </i>
      </button>
    </div>
  </li>
</script>

<script type="text/x-kendo-template" id="ide_history_template">
  <div class="bbn-ide-history" v-bbn-fill-height>
    <div class="bbn-ide-history-splitter" v-bbn-fill-height>
      <div class="bbn-full-height">
        <div class="bbn-ide-history-tree" v-bbn-fill-height></div>
      </div>
      <div class="bbn-full-height">
        <div class="bbn-ide-history-code" v-bbn-fill-height></div>
      </div>
    </div>
  </div>
</script>