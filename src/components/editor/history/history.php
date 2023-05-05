<!-- HTML Document -->

<div class="bbn-overlay">
  <bbn-splitter :resizable="true"
                :collapsible="true">
    <bbn-pane size="20%">
      <bbn-list :source="source.files"
                source-text="time"
                source-value="basename"
                @select="selected"/>
    </bbn-pane>
    <bbn-pane>
      <div class="overlay">
          <bbn-loader v-if="loading"></bbn-loader>
          <bbn-code v-else
                    v-model="content"
                    :readonly="true"
                    :mode="mode"/>
      </div>
    </bbn-pane>
  </bbn-splitter>
</div>
