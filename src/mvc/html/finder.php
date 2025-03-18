<!-- HTML Document -->
<div class="bbn-overlay bbn-flex-height appui-finder">
  <bbn-toolbar>
    <div class="bbn-xl bbn-hpadding bbn-vspadding">
      <i class="nf nf-md-apple_finder bbn-large"></i> &nbsp;
      File finder
    </div>
    <div>
    </div>
    <div>
  		<bbn-menu :source="menuData"
                ref="menu"/>
    </div>
  </bbn-toolbar>
  <div class="bbn-flex-fill">
    <bbn-router :nav="true"
                :root="source.root + 'finder/'"
                :base-url="source.root + 'finder/'"
                :url-navigation="true"
                :scrollable="false"
                :autoload="true"
                class="bbn-overlay"/>
  </div>
</div>