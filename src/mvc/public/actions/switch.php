<?php
if ( !empty($ctrl->inc->dir) &&
  !empty($ctrl->post['ext']) &&
  !empty($ctrl->post['file'])
){
  $res = $ctrl->inc->dir->change_ext($ctrl->post['ext'], $ctrl->post['file']);
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