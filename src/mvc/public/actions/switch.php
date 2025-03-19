<?php
if ( !empty($ctrl->inc->dir) &&
  !empty($ctrl->post['ext']) &&
  !empty($ctrl->post['file'])
){
  $res = $ctrl->inc->dir->changeExt($ctrl->post['ext'], $ctrl->post['file']);
  if ( !empty($res) ){
    $ctrl->obj->data = $res;
  }
  else {
    $ctrl->obj->error = $ctrl->inc->dir->getLastError();
  }
}
else {
  $ctrl->obj->error = 'Empty variable(s).';
}