<!-- HTML Document -->
<div class="bbn-overlay">
  <appui-newide-codemirror v-model="myCode"
                           :theme="myTheme"
                           :mode="myMode"
                           @keydown="keydown"/>
</div>