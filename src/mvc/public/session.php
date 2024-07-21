<?php
if ( isset($ctrl->post['type']) ){
  $ctrl->obj->data = \bbn\X::getTree(
    $ctrl->post['type'] === 'server' ?
	    $_SERVER : $_SESSION
  );
}
else{
  $ctrl->obj->icon = 'nf nf-fa-user_secret';
  $ctrl->combo('Infos Session', ['root' => $ctrl->pluginPath('appui-ide')]);
}
