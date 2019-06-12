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
  <bbns-column title="<?=_("Type")?>"
              field="type"
              :width="80"
  ></bbns-column>

  <bbns-column title="<?=_("Last")?>"
              :width="100"
              field="last_date"
              type="date"
  ></bbns-column>

  <bbns-column title="<?=_("Count")?>"
              field="count"
              :width="60"
  ></bbns-column>

  <bbns-column title="<?=_("Error")?>"
              field="error"
  ></bbns-column>

  <bbns-column title="<?=_("File")?>"
              field="file"

  ></bbns-column>
  <bbns-column title="<?=_("Line")?>"
              field="line"
              :width="80"
              type="number"
  ></bbns-column>
  <bbns-column  title="<?=_("First")?>"
               :width="100"
               field="first_date"
               type="date"
  ></bbns-column>
</bbn-table>

<!--
<script type="text/x-template" id="apst-ide-info-error-log">
  <div style="height: 200px; position:relative">
    <bbn-table :source=""
               :sortable="true"
               ref="tableInfoErrorLog"
               class="bbn-overlay"
    >
      <bbns-column title="dddd"
                  field="index"
                  :width="40"
      ></bbns-column>
      <bbns-column title="<?=_("Message")?>"
                  field="text"
      ></bbns-column>
    </bbn-table>
  </div>
</script>
-->
