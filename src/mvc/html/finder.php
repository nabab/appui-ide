<!-- HTML Document -->
<div class="bbn-overlay bbn-flex-height appui-finder">
  <bbn-toolbar>
    <div class="bbn-xl bbn-hpadded bbn-vspadded">
      <i class="nf nf-mdi-apple_finder bbn-large"></i> &nbsp;
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
                :autoload="true"/>
  </div>
</div>