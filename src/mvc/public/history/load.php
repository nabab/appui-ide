<?php

/** @var $this \bbn\mvc\controller */

if ( !empty($dir) && !empty($this->post['url']) ){
  $res = $dir->history($this->post['url']);
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