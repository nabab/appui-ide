<!-- HTML Document -->
<!--<div id="appui_constants_page">
{{#names}}
<h3><span>{{prefix}}</span></h3>
<ul>
  {{#constants}}
  <li><span class="bbn-prefix">{{prefix}}</span><span class="bbn-constant">{{constant}}</span><span class="bbn-value">{{value}}</span></li>
  {{/constants}}
</ul>
{{/names}}
</div>-->
<div id="appui_constants_page"><?php
if ( !empty($names) ){
  foreach ($names as $namespace){ ?>
  <h3><span><?=$namespace['prefix']?></span></h3>
    <ul><?php
    foreach ($namespace['constants'] as $content){ ?>
      <li>
        <span class="bbn-prefix"><?=$content['prefix']?></span>
        <span class="bbn-constant"><?=$content['constant']?></span>
        <span class="bbn-value"><?=$content['value']?></span>
      </li>
    <?php }?>
  </ul>
<?php
  }
} ?>
</div>