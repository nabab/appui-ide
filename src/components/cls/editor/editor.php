<!-- HTML Document -->

<div class="appui-ide-cls-editor bbn-overlay">
  <bbn-form :source="source"
            :scrollable="true"
            mode="big">
    <div class="bbn-padding">
      <h1>
        <?= _("Class ") ?> <bbn-editable v-if="!read" v-model="source.name"/>
        <span v-else >{{source.name}}</span>
      </h1>
      <div class="bbn-w-100">
        <bbn-markdown v-if="!read" v-model="source.doc.description"
                      placeholder="<?= _("Write a description for your class here") ?>"/>
        <div v-else class="bbn-w-70">
          <p><strong><u>Description :</u></strong></p><br>
        	<span v-if="source.doc.description"> {{source.doc.description}} </span>
          <span v-else> (None) </span>
      	</div>
      </div>
      <div class="bbn-grid-fields bbn-top-margin">
        <template v-for="(val, tag) in source.doc.tags">
          <label v-if="!read" v-text="tag"/>
          <h3 v-else>
            <u>{{tag}} : </u>
          </h3>
					<!--h3 v-if="!read" v-text="tag"/-->
          <bbn-input v-if="!read" v-model="source.doc.tags[tag]"/>
          <h3 v-else> {{source.doc.tags[tag]}}</h3>
        </template>
      </div>
    </div>
  </bbn-form>
</div>
