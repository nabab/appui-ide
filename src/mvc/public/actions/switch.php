<?php
if ( !empty($dir) &&
  !empty($this->post['ext']) &&
  !empty($this->post['file'])
){
  $res = $dir->change_ext($this->post['ext'], $this->post['file']);
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