<?php
if ( isset($dir) &&
  !empty($this->post['dir']) &&
  !empty($this->post['type']) &&
  !empty($this->post['path']) &&
  !empty($this->post['name'])
){
  $files = $dir->delete($this->post['dir'], $this->post['path'], $this->post['name'], $this->post['type']);
  if ( !empty($files) ){
    $this->obj->data = $files;
  }
  else {
    $this->obj->error = $dir->get_last_error();
  }
}
else {
  $this->obj->error = 'Empty variable(s).';
}
