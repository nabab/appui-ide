<div class="bbn-overlay">
  <div class="bbn-h-100 code">
    <bbn-router mode="tabs"
                :scrollable="false"
                ref="tabstrip"
    >
      <bbn-container :fixed="true"
                     :load="false"
                     url="permissions"
                     :label="titles.permissions"
                     icon="nf nf-md-apple_keyboard_option"
                     :source="source.permissions"
                     component="appui-ide-settings-permission"
      ></bbn-container>
      <bbn-container :fixed="true"
                     :load="false"
                     url="sub_permission"
                     :label="titles.subPerm"
                     icon="nf nf-oct-file_submodule"
                     :source="source.permissions"
                     component="appui-ide-settings-sub_perm"
      ></bbn-container>
      <bbn-container :fixed="true"
                     :load="false"
                     url="help"
                     :label="titles.help"
                     icon="nf nf-md-help_circle"
                     :source="source.permissions"
                     component="appui-ide-settings-help"
      ></bbn-container>
      <bbn-container :fixed="true"
                     :load="false"
                     url="messages"
                     :label="titles.messages"
                     icon="nf nf-md-message_text"
                     :source="source"
                     component="appui-ide-settings-message"
      ></bbn-container>
    </bbn-router>
  </div>
</div>
