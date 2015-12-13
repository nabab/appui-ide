<?php
if ( isset($this->post['dir'], $this->post['path'], $this->post['name'], $this->post['type']) ){
  $dir = new \bbn\ide\directories($this->inc->options);
  $res = $dir->create(
    $this->post['dir'],
    $this->post['path'],
    $this->post['name'].(empty($this->post['ext']) ? '' : '.'.$this->post['ext']),
    $this->post['type']);
  if ( $res === 1 ){
    $this->obj->success = 1;
  }
  else{
    $this->obj->error = $dir->get_last_error();
  }
}