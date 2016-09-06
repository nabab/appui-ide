<?php
if ( !empty($ctrl->inc->dir) &&
  !empty($ctrl->post['dir']) &&
  !empty($ctrl->post['path']) &&
  !empty($ctrl->post['type']) &&
  !empty($ctrl->post['name']) &&
  !empty($ctrl->post['file'])
){
  $res = $ctrl->inc->dir->copy($ctrl->post['dir'], $ctrl->post['path'], $ctrl->post['name'], $ctrl->post['type'], $ctrl->post['file']);
  if ( !empty($res) ){
    $ctrl->obj->data->success = true;
    if ( is_string($res) ){
      $ctrl->obj->data->file = $res;
    }
  }
  else {
    $ctrl->obj->error = $ctrl->inc->dir->get_last_error();
  }
}
else {
  $ctrl->obj->error = 'Empty variable(s).';
}