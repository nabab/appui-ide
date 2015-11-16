<?php
/* @var $this \bbn\mvc */
if ( $cfg = $this->get_model('./directory', [
  'path' => empty($this->post['dir']) ? $this->data['dir'] : $this->post['dir']
]) ) {
  if (isset($this->post['file'])) {
    $this->data = [
      'dir' => $this->post['dir'],
      'file' => isset($cfg['files']['CTRL']) && (\bbn\str\text::file_ext($this->post['file']) !== 'php') ? substr($this->post['file'], 0, strrpos($this->post['file'], "/")) : $this->post['file']
    ];
  }

  if (isset($this->data['dir'], $this->data['file'])) {
    if (!in_array($this->data, $_SESSION[BBN_SESS_NAME]['ide']['list'])) {
      array_push($_SESSION[BBN_SESS_NAME]['ide']['list'], [
        'dir' => $this->data['dir'],
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