<div class="bbn-w-100">
  <bbn-form :source="data"
            :data="formData"
            :action="source.root + 'actions/create'"
            :validation="validate"
            @success="onSuccess"
            @failure="failureActive">
    <div class="bbn-padding bbn-w-100">
      <div class="bbn-grid-fields"><label><?= _("Name") ?></label>
        <div class="bbn-flex-width">
          <div class="bbn-flex-fill">
            <bbn-input bbn-model="data.name"
                       required="required"
                       :focused="true"
                       ref="filename"
                       class="bbn-w-100"/>
          </div>
          <bbn-dropdown bbn-if="source.isFile && availableExtensions && (availableExtensions.length > 1)"
                        :source="extensions"
                        bbn-model="data.extension"
                        required="required"
                        style="width: 100px"/>
        </div>

        <h3 bbn-if="isMVC && source.isFile"
            class="bbn-grid-full">
          <?= _("What kind of MVC file do you want to create ?") ?>
        </h3>

        <div class="bbn-grid-full bbn-bottom-padding"
             bbn-if="isMVC && source.isFile">
          <bbn-radio :required="true"
                     :source="templates"
                     bbn-model="data.template"
                     @change="onChangeTemplate"
                    :vertical="true"/>
        </div>

        <label bbn-if="data.template === 'file' && types.length">
          <?= _("Type") ?>
        </label>
        <div  bbn-if="(data.template === 'file') && types.length">
          <bbn-dropdown :source="types"
                        bbn-model="data.tab"
                        required="required"
                        class="bbn-w-100"/>
        </div>

        <label bbn-if="hasFileDetails">
          <?= _("Controller") ?>
        </label>
        <div bbn-if="hasFileDetails">
          <bbn-radio :required="true"
                     :source="[{text: _('Public'), value: 'public'}, {text: _('Private'), value: 'private'}]"
                     bbn-model="data.controller"/>
        </div>

        <label bbn-if="hasFileDetails">
          <?= _("Model") ?>
        </label>
        <div bbn-if="hasFileDetails">
          <bbn-radio :required="true"
                     :source="[{text: _('Accessible in javascript'), value: 'jsmodel'}, {text: _('Not accessible in javascript'), value: 'model'}, {text: _('No model'), value: 'none'}]"
                     bbn-model="data.model"/>
        </div>

        <label bbn-if="hasFileDetails">
          <?= _("View HTML") ?>
        </label>
        <div bbn-if="hasFileDetails">
          <bbn-radio :required="true"
                     :source="[{text: 'PHP', value: 'php'}, {text: _('HTML'), value: 'html'}, {text: _('No HTML view'), value: 'none'}]"
                     bbn-model="data.html"/><br><br>
          <bbn-checkbox bbn-model="data.container"
                        :label="_('With a container')"/>
        </div>

        <label bbn-if="hasFileDetails">
          <?= _("Javascript") ?>
        </label>
        <div bbn-if="hasFileDetails">
          <bbn-radio :required="true"
                     :source="[{text: _('With a container'), value: 'container'}, {text: _('Empty'), value: 'empty'}, {text: _('No HTML view'), value: 'none'}]"
                     bbn-model="data.html"/>
        </div>

        <label bbn-if="hasFileDetails">
          <?= _("Styles CSS") ?>
        </label>
        <div bbn-if="hasFileDetails">
          <bbn-radio :required="true"
                     :source="[{text: 'CSS', value: 'css'}, {text: _('Less'), value: 'less'}, {text: _('Scss'), value: 'scss'}, {text: _('No style'), value: 'none'}]"
                     bbn-model="data.css"/><br><br>
          <bbn-checkbox bbn-model="data.class"
                        :label="_('With a class')"/>
        </div>

        <label><?= _("Path") ?></label>
        <div class="bbn-flex-width">
          <div class="bbn-flex-fill">
            <bbn-input bbn-model="data.path"
                       readonly="readonly"
                       required="required"
                       class="bbn-w-100"/>
          </div>
          <div class="bbn-nowrap">
            <bbn-button @click="selectDir"><?= _("Browse") ?></bbn-button>
            <bbn-button @click="getRoot"><?= _("Root") ?></bbn-button>
          </div>
        </div>

      </div>
    </div>
  </bbn-form>
</div>
