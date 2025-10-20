<!-- HTML Document -->
<div class="bbn-overlay">
  <bbn-router mode="tabs"
              :autoload="true">
    <bbns-container url="list"
                    :label="_('List')"
                    :load="true"
                    :pinned="true"
                    :closable="false"/>
  </bbn-router>
</div>