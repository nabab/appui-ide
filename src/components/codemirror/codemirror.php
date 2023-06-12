<!-- HTML Document -->

<div class="bbn-overlay">
  <appui-newide-code ref="code"
                   @keydown="onKeyDown"
                   v-model="myCode"
                   :extensions="getExtensions()"
                   :theme="theme"
                   :mode="mode" />
</div>