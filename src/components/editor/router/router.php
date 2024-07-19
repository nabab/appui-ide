<!-- HTML Document -->

<div class="bbn-overlay appui-ide-editor-router">
  <bbn-router :autoload="true"
              v-if="routerSource.length"
              :nav="true"
              :source="routerSource"
              ref="tabstrip"/>
</div>
