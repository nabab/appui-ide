<?php
// Non mandatory, thew path to explore
if ( isset($this->post['dir']) ){
  $this->data['dir'] = $this->post['dir'];
}
else if ( isset($this->post['mode']) ){
  $this->data['dir'] = $this->post['mode'];
  $this->data['onlydir'] = $this->post['onlydir'];
}
if ( isset($this->data['dir']) ){
  if ( isset($this->post['path']) ){
    $this->data['path'] = $this->post['path'];
  }
  $this->obj->data = $this->get_model();
  $this->inc->session->set($this->data['dir'], 'ide', 'dir');
}