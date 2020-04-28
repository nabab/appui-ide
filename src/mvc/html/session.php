<!-- HTML Document -->
<div class="bbn-hpadded bbn-flex-height">
  <div>
    <div class="bbn-w-100 bbn-vpadded">
      <bbn-button icon="nf nf-fa-user_secret"
                  @click="type = 'session'">
      </bbn-button> 
      <bbn-button icon="nf nf-fa-server"
                  @click="type = 'server'">
      </bbn-button>
    </div>
    <h2>
      <?=_('Infos')?> 
      <span v-text="type === 'server' ? '<?=_('Server')?>' : '<?=_('Session')?>'"></span>
    </h2>
  </div>
  <div class="bbn-flex-fill">
    <bbn-tree v-if="items.length"
              class="bbn-overlay"
              ref="tree"
              :source="items"
    ></bbn-tree>
  </div>
</div>