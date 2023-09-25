<!-- HTML Document -->

<div class="appui-ide-cls-testor-method-suggest bbn-overlay">
  <bbn-panelbar :flex="true"
                :scrollable="false"
                :source="methods"/>
  <br><br>
  <div class="bbn-c">
    <bbn-button title="AddTest"
                text="Confirm"
                class="bbn-green"
                :icon="'nf nf-cod-checklist'"
                @click.stop="confirm"></bbn-button>
  </div>
</div>