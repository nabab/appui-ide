<!-- HTML Document -->

<div class="bbn-overlay bbn-flex-height">
  <bbn-upload save-url="ide/img2base64"
              remove-url="ide/img2base64"
              @success="success"
              :paste="true"
  ></bbn-upload>
  <div v-if="base64" style="max-height: 25%">
    <img :src="base64" style="max-height: 100%; max-width: 100%">
  </div>
  <bbn-textarea v-model="base64" class="bbn-flex-fill"></bbn-textarea>
</div>