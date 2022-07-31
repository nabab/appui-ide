<!-- HTML Document -->

<div :class="[componentClass, 'bbn-reset', 'bbn-overlay']"
     @keydown="onKeyDown"
     :title="_('%s editor', currentMode)">
  <div ref="element"
       class="bbn-100"/>
</div>