<?php
if ( !empty($ctrl->inc->dir) &&
  !empty($ctrl->post['dir']) &&
  !empty($ctrl->post['dest']) &&
  !empty($ctrl->post['src']) &&
  !empty($ctrl->post['type'])
){
  $res = $ctrl->inc->dir->move($ctrl->post['dir'], $ctrl->post['src'], $ctrl->post['dest'], $ctrl->post['type']);
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