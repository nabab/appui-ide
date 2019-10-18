<?php
if ( isset($ctrl->post['type']) ){
  $ctrl->obj->data = \bbn\x::get_tree(
    $ctrl->post['type'] === 'server' ?
	    $_SERVER : $_SESSION
  );
}
else{
  $ctrl->obj->icon = 'nf nf-fa-user_secret';
  $ctrl->combo('Infos Session', ['root' => APPUI_IDE_ROOT]);
}