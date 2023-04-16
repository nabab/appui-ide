<!-- HTML Document -->
<div class="bbn-overlay" v-if="ready">
  <appui-newide-codemirror v-model="myCode"
                           :theme="myTheme"
                           :mode="myMode"
                           @keydown="keydown"/>
</div>