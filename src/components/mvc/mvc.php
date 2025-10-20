<!-- @tabLoaded="loadingTab" -->
<div class="bbn-overlay component-mvc">
  <div class="bbn-h-100 code">
    <bbn-router :autoload="false"
                mode="tabs"
                ref="tabstrip"
                :source="routerSource"
                def="php"
                v-if="tabsReady"
    ></bbn-router>
  </div>
</div>
