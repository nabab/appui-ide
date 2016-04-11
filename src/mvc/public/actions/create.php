<?php
/**
 * @var \bbn\mvc\controller $this
 * @var \bbn\ide\directories $dir
 */
if ( isset($dir, $this->post['dir'], $this->post['path'], $this->post['name'], $this->post['type']) ){
  $res = $dir->create(
    $this->post['dir'],
    $this->post['tab'],
    $this->post['path'],
    $this->post['name'] . ( empty($this->post['ext']) ? '' : '.' . $this->post['ext'] ),
    $this->post['type']);
  if ( is_string($res) ){
    if ( !empty($this->post['code']) ){
      // Add file to page permissions table
      
    }
    $this->obj->success = 1;
    $this->obj->id = $res;
  }
  else{
    $this->obj->error = $dir->get_last_error();
  }
}