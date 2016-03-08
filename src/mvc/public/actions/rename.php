<?php
if ( !empty($dir) &&
  !empty($this->post['dir']) &&
  !empty($this->post['path']) &&
  !empty($this->post['type']) &&
  !empty($this->post['name'])
){
  $this->obj->data = $dir->rename($this->post['dir'], $this->post['path'], $this->post['name'], $this->post['type']);
}