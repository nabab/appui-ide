<?php
/**
 * @var \bbn\mvc\controller $this
 * @var \bbn\ide\directories $dir
 */
if ( isset($dir, $this->post['dir'], $this->post['url'], $this->post['editors']) ){
  $dir->set_preferences($this->post['dir'], $this->post['editors'], $this->inc->pref);
  $list = $this->inc->session->get('ide', 'list');
  $idx = array_search($this->post['url'], $list);
  if ( $idx !== false ){
    array_splice($list, $idx, 1);
    $this->inc->session->set($list, 'ide', 'list');
    $this->obj->success = 1;
  }
  else{
    $this->obj->error = $r;
  }
}
