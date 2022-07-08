<?php
if ( !empty($ctrl->post['id']) &&
  !empty($ctrl->post['code']) &&
  !empty($ctrl->post['text'])
){
  if ( $ctrl->inc->options->add([
    'id_parent' => $ctrl->post['id'],
    'code' => $ctrl->post['code'],
    'text' => $ctrl->post['text']
  ]) ){
    $ctrl->obj->data->success = 1;
  }
  else {
    $ctrl->obj->error = 'Error.';
  }
}
return false;