<?php
/** @var \bbn\mvc\controller $this */
if ( isset($dir) ){
  $cfg = [];
  if ( isset($this->post['selections']) ){
    $cfg['selections'] = $this->post['selections'];
  }
  if ( isset($this->post['marks']) ){
    $cfg['marks'] = $this->post['marks'];
  }
  $res = $dir->save($this->post['file'], $this->post['code'], $cfg, $this->inc->pref);
  $this->obj = $res;
}
