<?php
/* @var $ctrl \bbn\mvc */
if ( isset($ctrl->post['theme'], $ctrl->post['font'], $ctrl->post['font_size']) ){
  $ctrl->data = $ctrl->post;
  $ctrl->inc->user->set_cfg(["ide" => ["theme" => $ctrl->data['theme'], "font" => $ctrl->data['font'], "font_size" => $ctrl->data['font_size']]]);
  $ctrl->inc->user->save_cfg();
  $ctrl->obj->success = 1;
  $ctrl->obj->script = 'appui.fn.closePopup();';
}
else{
  $ctrl->error = "One or more values are missing";
}
