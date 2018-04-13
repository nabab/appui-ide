<!-- HTML Document -->
<!--
old
<div id="error_log_grid" class="bbn-100"></div>-->

<bbn-table ref="error_log"
           :source="source.data"
           class="bbn-100"
           :info="true"
           :sortable="true"
           :editable="true"
           :pageable="true"        
>
  <bbn-column title="<?=_("Type")?>"
              field="type"
              :width="80"
  ></bbn-column>

  <bbn-column title="<?=_("Last")?>"
              :width="100"
              field="last_date"
              type="date"
  ></bbn-column>

  <bbn-column title="<?=_("Count")?>"
              field="count"
              :width="60"
  ></bbn-column>

  <bbn-column title="<?=_("Error")?>"
              field="error"
  ></bbn-column>

  <bbn-column title="<?=_("File")?>"
              field="file"

  ></bbn-column>
  <bbn-column title="<?=_("Line")?>"
              field="line"
              :width="80"
              type="number"
  ></bbn-column>
  <bbn-column  title="<?=_("First")?>"
               :width="100"
               field="first_date"
               type="date"
  ></bbn-column>
</bbn-table>

<!--
<script type="text/x-template" id="apst-ide-info-error-log">
  <div style="height: 200px; position:relative">
    <bbn-table :source=""
               :sortable="true"
               ref="tableInfoErrorLog"
               class="bbn-full-screen"
    >
      <bbn-column title="dddd"
                  field="index"
                  :width="40"
      ></bbn-column>
      <bbn-column title="<?=_("Message")?>"
                  field="text"
      ></bbn-column>
    </bbn-table>
  </div>
</script>
-->
