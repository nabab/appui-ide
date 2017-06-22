<!--ul class="bbn-ide-context"></ul-->
<bbn-splitter class="bbn-ide-container" orientation="vertical">
  <div style="height: 40px; overflow: visible" :scrollable="false">
    <bbn-toolbar class="bbn-ide">
      <div>
        <bbn-input class="ide-tree-search" placeholder="Search file"></bbn-input>
      </div>
      <div></div>
      <div>
        <bbn-dropdown class="ide-rep-select" :source="ddrep" v-model="currentRep" :value-template="tplrep"></bbn-dropdown>
      </div>
      <div></div>
      <div>
        <bbn-button title="Test code!"
                    @click="test"
                    icon="fa fa-magic"></bbn-button>
      </div>
      <div>
        <bbn-button title="Show History"
                    @click="history"
                    icon="fa fa-history"></bbn-button>
      </div>
      <div></div>
      <div>
        <bbn-menu :source="menu"></bbn-menu>
      </div>
    </bbn-toolbar>
  </div>
  <div class="bbn-full-height bbn-w-100">
    <bbn-splitter class="bbn-code-container" orientation="horizontal">
      <div style="width: 200px; overflow: auto" :collapsible="true" :resizable="true">
        <bbn-tree class="tree" :source="treeLoad" :select="treeNodeActivate" :cfg="{renderNode: treeRenderNode, lazyLoad: treeLazyLoad}" ref="filesList"></bbn-tree>
      </div>
      <div style="padding:0px" :collapsible="true" :resizable="true" :scrollable="false">
        <div style="position: absolute; top: auto; left: auto; margin: 50%; text-align: center">
          <i class="fa fa-code"></i>
        </div>
        <!--<div class="bbn-full-height" id="tabstrip_editor" ref="tabstrip"></div>-->
        <bbn-tabnav id="tabstrip_editor" ref="tabstrip" :autoload="true"></bbn-tabnav>
      </div>
      <div style="width: 200px" :collapsible="true" :resizable="true" :collapsed="true">
        <iframe style="width: 100%" class="bbn-full-height" src="https://doc.mybbn.so"></iframe>
      </div>
    </bbn-splitter>
  </div>
</bbn-splitter>

<script type="text/x-template" id="ide_new_template">
  <bbn-form ref="new_form">
    <div class="bbn-form-label mvc-ele" v-if="isMVC()">Type</div>
    <div class="bbn-form-field mvc-ele" v-if="isMVC()">
      <bbn-dropdown class="bbn-full-width" ref="types" :source="types" v-model="selectedType" name="tab" required="required"></bbn-dropdown>
    </div>
    <div class="bbn-form-label">Name</div>
    <div class="bbn-form-field">
      <bbn-input type="text" name="name" v-model="name" class="bbn-full-width" required="required"></bbn-input>
      <bbn-dropdown ref="ext" :source="extensions" v-model="selectedExt" name="ext" required="required" style="width: 100px" v-if="isFile"></bbn-dropdown>
    </div>
    <div class="bbn-form-label">Path</div>
    <div class="bbn-form-field">
      <bbn-input class="bbn-full-width" type="text" name="path" v-model="path" readonly="readonly" required="required"></bbn-input>
      <div style="float: left">
        <bbn-button @click="selectDir">Browse</bbn-button>
        <bbn-button @click="setRoot">Root</bbn-button>
      </div>
    </div>
    <div class="bbn-form-label"></div>
    <div class="bbn-form-field" style="text-align: right">
      <bbn-button type="submit" icon="fa fa-check"> Save</bbn-button>
      <bbn-button @click="close" icon="fa fa-close"> Cancel</bbn-button>
    </div>
  </bbn-form>
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
        <i class="fa fa-close"></i> Cancel
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
        <button class="k-button" type="button" onclick="bbn.fn.closePopup();"><i class="fa fa-close"></i> Annule
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
</script>

<script type="text/x-kendo-template" id="ide_child_permissions_form_template">
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
</script>

<script type="text/x-kendo-template" id="ide_history_template">
  <div class="bbn-full-height bbn-ide-history">
    <div class="bbn-full-height bbn-ide-history-splitter">
      <div class="bbn-full-height">
        <div class="bbn-full-height bbn-ide-history-tree"></div>
      </div>
      <div class="bbn-full-height">
        <div class="bbn-full-height bbn-ide-history-code"></div>
      </div>
    </div>
  </div>
</script>