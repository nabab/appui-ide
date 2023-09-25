<!-- HTML Document -->
<div class="bbn-overlay" >
  <appui-ide-codemirror v-if="ready"
            ref="codemirror"
            :doc="myCode"
            :theme="myTheme"
            :mode="myMode"
            @keydown="keydown"/>
</div>
