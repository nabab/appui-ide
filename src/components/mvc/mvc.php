<!-- @tabLoaded="loadingTab" -->
<div class="bbn-overlay component-mvc">
  <div class="bbn-h-100 code">
    <bbn-router :autoload="false"
                :nav="true"
                ref="tabstrip"
                :source="routerSource"
                v-if="tabsReady"
    ></bbn-router>
  </div>
</div>
