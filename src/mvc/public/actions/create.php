<?php
/** @var $ctrl \bbn\mvc\controller */
if ( isset($ctrl->inc->ide) ){
  \bbn\x::log([$ctrl->post], 'vito');
  if ( !empty($ctrl->inc->ide->create($ctrl->post)) ){
    $ctrl->obj->success = true;
  }
  else {
    $ctrl->obj->success = false;
    $ctrl->obj->error = _('Impossible to create the element');
  }
}
