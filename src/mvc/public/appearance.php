<?php
/* @var $ctrl \bbn\Mvc */
if ( isset($ctrl->post['theme'], $ctrl->post['font'], $ctrl->post['font_size']) ){
  $ctrl->data = $ctrl->post;
  $ctrl->inc->user->setCfg(["ide" => ["theme" => $ctrl->data['theme'], "font" => $ctrl->data['font'], "font_size" => $ctrl->data['font_size']]]);
  $ctrl->inc->user->saveCfg();
  $ctrl->obj->success = 1;
  $ctrl->obj->script = 'bbn.fn.closePopup();';
}
else{
  $ctrl->error = "One or more values are missing";
}
