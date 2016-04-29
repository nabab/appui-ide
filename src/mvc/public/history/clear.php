<?php

/** @var $this \bbn\mvc\controller */

if ( !empty($dir) ){
  $res = $dir->history_clear($this->post['url']);
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