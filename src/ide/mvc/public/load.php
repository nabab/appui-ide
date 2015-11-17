<?php
/* @var $this \bbn\mvc */
if ( $cfg = $this->get_model('./directory', [
  'path' => empty($this->post['dir']) ? $this->data['dir'] : $this->post['dir']
]) ) {
  if ( !empty($this->post['file']) && !empty($this->post['dir']) && !empty($this->post['subdir']) ){
    $this->data = $this->post;
    if (!in_array($this->data, $_SESSION[BBN_SESS_NAME]['ide']['list'])) {
      array_push($_SESSION[BBN_SESS_NAME]['ide']['list'], [
        'dir' => $this->data['dir'],
        'subdir' => $this->data['subdir'],
        'file' => $this->data['file']
      ]);
    }
    $this->obj->data = $this->get_model();
    if (!empty($this->obj->data['def'])) {
      $this->obj->url = $this->data['file'] . '/' . $this->obj->data['def'];
    } else {
      $this->obj->url = $this->data['file'];
    }
  }
}
