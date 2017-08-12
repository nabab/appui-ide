<?php
/** @var $ctrl \bbn\mvc\controller */
if ( isset($ctrl->inc->ide) ){
  if ( !empty($ctrl->inc->ide->delete($ctrl->post)) ){
    $ctrl->obj->success = true;
  }
  else {
    $ctrl->obj->error = $ctrl->inc->ide->get_last_error();
  }
}