<?php
/** @var $ctrl \bbn\mvc\controller */
if ( isset($ctrl->inc->ide) ){
  // if ( !empty($ctrl->type) && ($ctrl->post['type'] === 'components') ){
  //   $ctrl->post['path'] .= $ctrl->post['name'].'/';
  // }
  if ( !empty($ctrl->inc->ide->create($ctrl->post)) ){
    $ctrl->obj->success = true;
  }
  else {
    $ctrl->obj->error = $ctrl->inc->ide->get_last_error();
  }
}
