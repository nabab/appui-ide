<!-- HTML Document -->

<div class="appui-ide-cls-testor-method-suggest bbn-overlay">
  <div class="bbn-grid">
    <bbn-toolbar class="bbn-radius"
                 :source="barButtons"></bbn-toolbar>
    <br>
    <bbn-panelbar :flex="true"
                  :scrollable="false"
                  @hook:mounted="setPanelBarColors"
                  @hook:updated="setPanelBarColors"
                  :source="methods"/>
    <!--br><br>
    <div class="bbn-c">
      <bbn-button title="AddTest"
                  label="Confirm"
                  class="bbn-green"
                  :icon="'nf nf-cod-checklist'"
                  @click.stop="confirm"></bbn-button>
    </div-->
  </div>
</div>