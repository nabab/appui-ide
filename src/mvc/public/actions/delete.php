<?php
if ( isset($ctrl->inc->dir) &&
  !empty($ctrl->post['dir']) &&
  !empty($ctrl->post['type']) &&
  !empty($ctrl->post['path']) &&
  !empty($ctrl->post['name'])
){
  $files = $ctrl->inc->dir->delete($ctrl->post['dir'], $ctrl->post['path'], $ctrl->post['name'], $ctrl->post['type']);
  if ( !empty($files) ){
    $ctrl->obj->data = $files;
  }
  else {
    $ctrl->obj->error = $ctrl->inc->dir->get_last_error();
  }
}
else {
  $ctrl->obj->error = 'Empty variable(s).';
}
