<!-- HTML Document -->

<div class="bbn-overlay appui-ide-editor-router">
  <bbn-router v-if="routerSource.length"
              :nav="true"
              :storage="false"
              :source="routerSource"
              ref="tabstrip"/>
</div>
