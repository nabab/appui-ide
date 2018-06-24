<div class="bbn-full-screen bbn-ide-i18n">
  <bbn-table :source="source.data"
             :columns="columns"
             editable="inline"
             :pageable="true"
             :sortable="true"
             :limit="25"
             :info="true"
             @change="insert_translation"
             ref="table"
             :expander="$options.components['file_linker']"
             :toolbar="$options.components['toolbar']"
  >
    <bbns-column field="original_exp"
                :editable="false"
                title="<?=_("Original Expression")?>"
    ></bbns-column>
  </bbn-table>
</div>
