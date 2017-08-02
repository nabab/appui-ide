<?php
/** @var $ctrl \bbn\mvc\controller */

if ( !empty($ctrl->post['id']) &&
  !empty($ctrl->post['code']) &&
  !empty($ctrl->post['text'])
){
  $cfg = [
    'code' => $ctrl->post['code'],
    'text' => $ctrl->post['text']
  ];
  if ( isset($ctrl->post['help']) ){
    $cfg['help'] = $ctrl->post['help'];
  }
  else {
    $ctrl->post['id'] = $ctrl->inc->options->from_code($ctrl->post['code'], $ctrl->post['id']);
  }
  if ( $ctrl->inc->options->set_prop($ctrl->post['id'], $cfg) ){
    $ctrl->obj->data->success = 1;
  }
  else {
    $ctrl->obj->error = 'Error.';
  }
}
return false;
