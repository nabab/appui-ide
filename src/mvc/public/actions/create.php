<?php
/** @var $ctrl \bbn\mvc\controller */
if ( isset($ctrl->inc->ide) ){
  if ( !empty($ctrl->inc->ide->create($ctrl->post)) ){
    $ctrl->obj->success = true;
    //die(var_dump("creato"));
  }
  else {
    $ctrl->obj->error = $ctrl->inc->ide->get_last_error();
    //die(var_dump("cccc"));
  }
}
