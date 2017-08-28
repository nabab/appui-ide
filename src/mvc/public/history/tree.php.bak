<?php
/** @var $ctrl \bbn\mvc\controller */
if ( isset($ctrl->inc->ide) && !empty($ctrl->post['url']) ){
  $res = $ctrl->inc->ide->history($ctrl->post['url']);
  if ( !empty($res) ){
    $ctrl->obj->data = $res;
  }
  else {
    $ctrl->obj->error = $ctrl->inc->ide->get_last_error();
  }
}