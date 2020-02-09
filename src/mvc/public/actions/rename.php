<?php
/** @var $ctrl \bbn\mvc\controller */
if ( isset($ctrl->inc->ide) ){
  if ( !empty($ctrl->inc->ide->rename($ctrl->post)) ){
    $ctrl->obj->success = true;
  }
  else {
    $ctrl->obj->success = false;
    $ctrl->obj->error = _('Imposssibile rename the element');
  }
}