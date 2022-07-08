<?php
if ( isset($ctrl->inc->dir) &&
  !empty($ctrl->post['dir']) &&
  !empty($ctrl->post['type']) &&
  !empty($ctrl->post['path']) &&
  !empty($ctrl->post['name'])
){
  $file = $ctrl->inc->dir->export($ctrl->post['dir'], $ctrl->post['path'], $ctrl->post['name'], $ctrl->post['type']);
  if ( !empty($file) ){
    $ctrl->obj->file = $file;
  }
  else {
    $ctrl->obj->error = 'Error.';
  }
}
else {
  $ctrl->obj->error = 'Empty variable(s).';
}
