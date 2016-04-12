<?php
if ( !empty($this->post['id']) && !empty($this->post['code']) ){
  if ( $this->inc->options->remove($this->inc->options->from_code($this->post['code'], $this->post['id'])) ){
    $this->obj->data->success = 1;
  }
  else {
    $this->obj->error = 'Error.';
  }
}
return false;
