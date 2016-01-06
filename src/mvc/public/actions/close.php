<?php
/**
 * @var \bbn\mvc\controller $this
 * @var \bbn\ide\directories $dir
 */
if ( isset($dir, $this->post['dir'], $this->post['file'], $this->post['editors']) ){
  $dir->close($this->post['dir'], $this->post['file'], $this->post['editors'], $this->inc->pref);
  $list = $this->inc->session->get('ide', 'list');
  $r = [
    'dir' => $this->post['dir'],
    'file' => $this->post['file']
  ];
  $idx = array_search($r, $list);
  if ( $idx !== false ){
    array_splice($list, $idx, 1);
    $this->inc->session->set($list, 'ide', 'list');
  }
  echo "1";
  \bbn\tools::dump($r, $list, $idx);
}