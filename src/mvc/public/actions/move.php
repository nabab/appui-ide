<?php
if ( !empty($dir) &&
  !empty($this->post['dir']) &&
  !empty($this->post['dest']) &&
  !empty($this->post['src']) &&
  !empty($this->post['type'])
){
  $res = $dir->move($this->post['dir'], $this->post['src'], $this->post['dest'], $this->post['type']);
  if ( !empty($res) ){
    $this->obj->data = $res;
  }
  else {
    $this->obj->error = $dir->get_last_error();
  }
}
else {
  $this->obj->error = 'Empty variable(s).';
}