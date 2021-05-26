<!--   @tabLoaded="loadingTab"-->
<div class="bbn-overlay">
  <div class="bbn-h-100 code">
    <bbn-router :autoload="false"
                :scrollable="false"
                :nav="true"
                :source="routerSource"
                ref="tabstripComponents"
    ></bbn-router>
  </div>
</div>
