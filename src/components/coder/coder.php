<!-- HTML Document -->
<div class="bbn-overlay" v-if="ready">
  <appui-newide-codemirror ref="codemirror"
                           :doc="myCode"
                           :theme="myTheme"
                           :mode="myMode"
                           @keydown="keydown"/>
</div>