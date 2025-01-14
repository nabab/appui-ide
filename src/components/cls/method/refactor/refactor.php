<!-- HTML Document -->

<div class="appui-ide-cls-testor-method-suggest bbn-overlay">
  <bbn-panelbar :flex="true"
                :scrollable="false"
                :source="getMeth"/>
  <br><br>
  <div class="bbn-c">
    <bbn-button title="AddTest"
                label="Confirm"
                class="bbn-green"
                :icon="'nf nf-cod-checklist'"
                @click.stop="confirm"></bbn-button>
  </div>
</div>