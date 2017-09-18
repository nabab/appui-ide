<?php
/** @var $ctrl \bbn\mvc\controller */
//die(var_dump("eccomi"));
if ( isset($ctrl->inc->ide) ){
  //die(var_dump(!empty($ctrl->inc->ide->copy($ctrl->post))) );
  if ( !empty($ctrl->inc->ide->copy($ctrl->post)) ){
    $ctrl->obj->success = true;
  }
  else {
    $ctrl->obj->error = $ctrl->inc->ide->get_last_error();
  }
}