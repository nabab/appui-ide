<div class="bbn-overlay bbn-vmiddle">
  <div class="bbn-w-70 bbn-padded">
    <bbn-input placeholder="<?=_('Search...')?>"
               v-model="search"
               class="bbn-w-100"
               @keydown.enter="searchInElement"
               ref="search_input"
    ></bbn-input>
  </div>
  <div class="bbn-w-30 bbn-padded">
    <bbn-checkbox label="<?=_('Match cases')?>"
                  v-model="matchCaseSearch"
                  :value="!matchCaseSearch"
    ></bbn-checkbox>
  </div>
</div>
