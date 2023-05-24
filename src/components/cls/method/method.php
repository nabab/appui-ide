<!-- HTML Document -->

<div class="appui-ide-cls-method bbn-overlay">
  <bbn-form :source="formData"
            :scrollable="true"
            v-if="ready"
            mode="big"
            :action="root + 'generating'"
            @success="onSuccess"
            :prefilled="true">
    <div class="bbn-padding">
      <h1>
        <?= _("Method") ?> <bbn-editable v-model="source.name"/>
      </h1>
      <h2>
        <bbn-input v-model="source.summary"
                   placeholder="<?= _("Summary") ?>"
                   class="bbn-w-100"/>
      </h2>
      <div class="bbn-w-100 bbn-small bbn-vmargin">
        <bbn-table v-if="source.arguments"
                   :scrollable="false"
                   :source="Object.values(source.arguments)">
          <bbns-column title="<?= _("Argument") ?>"
                       field="name"
                       :width="150"
                       :render="renderArgName"/>
          <bbns-column title="<?= _("Type") ?>"
                       :width="120"
                       field="type"
                       :render="renderArgType"/>
          <bbns-column title="<?= _("Req.") ?>"
                       :width="50"
                       ftitle="<?= _("Required") ?>"
                       field="required"
                       type="bool"/>
          <bbns-column title="<?= _("Default") ?>"
                       :width="150"
                       field="default"
                       :render="renderArgDefault"/>
          <bbns-column title="<?= _("Description") ?>"
                       field="default"/>
        </bbn-table>
      </div>
      <div class="bbn-grid-fields">
        <label><?= _("Visibility") ?></label>
        <bbn-radio v-model="source.visibility"
                   :source="visibilities"/>

        <label><?= _("Description") ?></label>
        <bbn-markdown v-model="source.description"
                      :autosize="true"/>
        <label><?= _("Code") ?></label>
        <div>
          <bbn-code v-model="source.code"
                    :fill="false"
                    mode="purephp"/>
        </div>

        <!--label><?= _("Returns") ?></label>
        <bbn-combo v-model="source.returns"
                   :source="types"/-->

        <!--label><?= _("Examples") ?></label>
        <div v-if="source.examples">
          <div v-for="ex in source.examples"
               class="bbn-w-100 bbn-vspadding">
            <bbn-code v-model="ex.code"
                      :fill="false"
                      mode="purephp"/-->

        <label v-if="source.example" ><?= _("Example:") ?></label>
        <div>
          <bbn-code v-model="source.example"
                    :fill="false"
                    mode="purephp"/>
        </div>

      </div>
    </div>
  </bbn-form>
  <bbn-loader v-else/>
</div>
