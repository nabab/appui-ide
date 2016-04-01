<?php
if ( !empty($dir) &&
  !empty($this->post['dir']) &&
  !empty($this->post['path']) &&
  !empty($this->post['type']) &&
  !empty($this->post['name']) &&
  !empty($this->post['file'])
){
  $res = $dir->copy($this->post['dir'], $this->post['path'], $this->post['name'], $this->post['type'], $this->post['file']);
  if ( !empty($res) ){
    $this->obj->data->success = true;
    if ( is_string($res) ){
      $this->obj->data->file = $res;
    }
  }
  else {
    $this->obj->error = $dir->get_last_error();
  }
}
else {
  $this->obj->error = 'Empty variable(s).';
}