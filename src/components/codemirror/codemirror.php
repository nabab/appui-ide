<!-- HTML Document -->

<div class="bbn-overlay">
  <bbn-code ref="code"
            @keydown="onKeyDown"
            @hook:mounted="init"
            v-model="myCode"
            :extensions="getExtensions()"
            :theme="theme"
            :mode="mode" />
</div>