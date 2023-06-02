<!-- HTML Document -->

<div class="appui-ide-cls-testor bbn-overlay">
  <bbn-loader v-if="isLoading"/>
  <bbn-button title="Install"
              icon="nf nf-fa-edit"
              class="bbn-state-selected"
              @click.stop="makeEnv">Install Test environment</bbn-button>
</div>
