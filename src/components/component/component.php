<!--   @tabLoaded="loadingTab"-->
<div class="bbn-overlay">
  <div class="bbn-h-100 code">
    <bbn-router :autoload="false"
                mode="tabs"
                :source="routerSource"
                ref="tabstripComponents"
    ></bbn-router>
  </div>
</div>
