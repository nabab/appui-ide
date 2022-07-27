<!-- HTML Document -->

<div class="bbn-overlay appui-ide-editor-router"
     v-if="routerSource.length">
  <bbn-router :autoload="false"
              :nav="true"
              :source="routerSource"
              ref="tabstrip"/>
</div>
