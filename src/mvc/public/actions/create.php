<?php
/**
 * @var \bbn\mvc\controller $this
 * @var \bbn\ide\directories $dir
 */
if ( isset($dir, $this->post['dir'], $this->post['path'], $this->post['name'], $this->post['type']) ){
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