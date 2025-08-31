<!-- HTML Document --
<div class="bbn-overlay" >
  <appui-ide-codemirror v-if="ready"
            ref="codemirror"
            :doc="myCode"
            :theme="myTheme"
            :mode="myMode"
            @keydown="keydown"/>
</div-->
<div class="bbn-overlay">
  <bbn-code bbn-if="ready"
            ref="code"
            @keydown="keydown"
            @hook:mounted="init"
            bbn-model="userCode"
            :scrollable="true"
            :theme="currentTheme"
            :mode="currentMode" />
  <div class="bbn-hidden"
       ref="container"/>
</div>
