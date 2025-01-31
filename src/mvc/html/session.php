<!-- HTML Document -->
<div class="bbn-hpadding bbn-overlay bbn-flex-height">
  <div>
    <div class="bbn-w-100 bbn-vpadding">
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
  <div class="bbn-flex-fill"
       bbn-if="items.length">
    <bbn-tree class="bbn-overlay"
              ref="tree"
              :source="items"/>
  </div>
</div>