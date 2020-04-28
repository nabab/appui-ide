<div class="bbn-overlay">
  <div class="bbn-h-100 code">
    <bbn-router :nav="true"
                :scrollable="false"
                ref="tabstrip"
    >
      <bbn-container :static="true"
                     :load="false"
                     url="permissions"
                     :title="titles.permissions"
                     icon="nf nf-mdi-apple_keyboard_option"
                     :source="source.permissions"
                     component="appui-ide-settings-permission"
      ></bbn-container>
      <bbn-container :static="true"
                     :load="false"
                     url="sub_permission"
                     :title="titles.subPerm"
                     icon="nf nf-oct-file_submodule"
                     :source="source.permissions"
                     component="appui-ide-settings-sub_perm"
      ></bbn-container>
      <bbn-container :static="true"
                     :load="false"
                     url="help"
                     :title="titles.help"
                     icon="nf nf-mdi-help_circle"
                     :source="source.permissions"
                     component="appui-ide-settings-help"
      ></bbn-container>
      <bbn-container :static="true"
                     :load="false"
                     url="messages"
                     :title="titles.messages"
                     icon="nf nf-mdi-message_text"
                     :source="source"
                     component="appui-ide-settings-message"
      ></bbn-container>
    </bbn-router>
  </div>
</div>
