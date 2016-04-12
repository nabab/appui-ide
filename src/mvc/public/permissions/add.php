<?php
if ( !empty($this->post['id']) &&
  !empty($this->post['code']) &&
  !empty($this->post['text'])
){
  if ( $this->inc->options->add([
    'id_parent' => $this->post['id'],
    'code' => $this->post['code'],
    'text' => $this->post['text']
  ]) ){
    $this->obj->data->success = 1;
  }
  else {
    $this->obj->error = 'Error.';
  }
}
return false;