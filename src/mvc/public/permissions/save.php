<?php
if ( !empty($this->post['id']) &&
  !empty($this->post['code']) &&
  !empty($this->post['text'])
){
  $cfg = [
    'code' => $this->post['code'],
    'text' => $this->post['text']
  ];
  if ( isset($this->post['help']) ){
    $cfg['help'] = $this->post['help'];
  }
  else {
    $this->post['id'] = $this->inc->options->from_code($this->post['code'], $this->post['id']);
  }
  if ( $this->inc->options->set_prop($this->post['id'], $cfg) ){
    $this->obj->data->success = 1;
  }
  else {
    $this->obj->error = 'Error.';
  }
}
return false;
