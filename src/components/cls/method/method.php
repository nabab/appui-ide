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
        <?= _("Method") ?>
        <bbn-editable v-if="!read" v-model="source.name"/>
        <span v-else>{{source.name}}</span>
      </h1>
      <h3>
        <bbn-input v-if="!read"
                   v-model="source.summary"
                   placeholder="<?= _("Summary") ?>"
                   class="bbn-w-100"/>
      <div v-else class="bbn-w-80">
        <span><strong><u>Summury :</u></strong></span>
        	<span v-if="source.summury"> {{source.summary}} </span>
          <span v-else> (None) </span>
      	</div>
      </h3>
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
        <label v-if="!read"><?= _("Visibility") ?></label>
        <span v-else><strong><u>Visibility :</u></strong></span>
        <bbn-radio v-if="!read" v-model="source.visibility"
                   :source="visibilities"/>
        <span v-else
              :source="visibilities"> {{source.visibility}}
        </span>

        <label v-if="!read"><?= _("Description") ?></label>
        <span v-else><strong><u>Description :</u></strong></span>
        <bbn-markdown v-if="!read" v-model="source.description"
                      :autosize="true"/>
       	<div v-else class="bbn-w-70">
					<span v-if="source.description"> {{source.description}} </span>
          <span v-else> (None) </span>
        </div>
        <label><?= _("Code") ?></label>
        <div>
          <bbn-code :readonly="read"
                    v-model="source.code"
                    :fill="false"
                    mode="purephp"/>
        </div>

        <!--label><?= _("Returns") ?></label>
        <bbn-combo v-model="source.returns"
                   :source="types"/-->

        <label v-if="source.example" ><?= _("Example:") ?></label>
        <div>
          <bbn-code v-model="source.example"
                    :fill="false"
                    mode="purephp"
                    :readonly="read"/>
        </div>

      </div>
    </div>
  </bbn-form>
  <bbn-loader v-else/>
</div>
