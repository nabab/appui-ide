<?php
if ( isset($ctrl->post['type']) ){
  $ctrl->obj->data = \bbn\x::get_tree(
    $ctrl->post['type'] === 'server' ?
	    $_SERVER : $ctrl->inc->user->get_session()
  );
}
else{
  $ctrl->obj->icon = 'fas fa-user-secret';
  $ctrl->combo('Infos Session', ['root' => APPUI_IDE_ROOT]);
}