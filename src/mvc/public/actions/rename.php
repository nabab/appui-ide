<?php
if ( !empty($dir) &&
  !empty($this->post['dir']) &&
  !empty($this->post['path']) &&
  !empty($this->post['type']) &&
  !empty($this->post['name'])
){
  $res = $dir->rename($this->post['dir'], $this->post['path'], $this->post['name'], $this->post['type']);
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