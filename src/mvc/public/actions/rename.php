<?php
if ( !empty($ctrl->inc->dir) &&
  !empty($ctrl->post['dir']) &&
  !empty($ctrl->post['path']) &&
  !empty($ctrl->post['type']) &&
  !empty($ctrl->post['name'])
){
  $res = $ctrl->inc->dir->rename($ctrl->post['dir'], $ctrl->post['path'], $ctrl->post['name'], $ctrl->post['type']);
  if ( !empty($res) ){
    $ctrl->obj->data = $res;
  }
  else {
    $ctrl->obj->error = $ctrl->inc->dir->get_last_error();
  }
}
else {
  $ctrl->obj->error = 'Empty variable(s).';
}