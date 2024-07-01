<!-- HTML Document -->

<div class="bbn-overlay">
  <bbn-code ref="code"
            @keydown="onKeyDown"
            @hook:mounted="init"
            :extensions="getExtensions"
            bbn-model="myCode"
            :theme="theme"
            :mode="mode" />
</div>
