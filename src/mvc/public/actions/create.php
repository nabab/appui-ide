<?php
/** @var $ctrl \bbn\mvc\controller */
if ( isset($ctrl->inc->ide) ){
  if ( !empty($ctrl->inc->ide->create($ctrl->post)) ){
    $ctrl->obj->success = true;
  }
  else {
    $ctrl->obj->success = false;
    $ctrl->obj->error = _('Impossible to create the element');
  }
}
