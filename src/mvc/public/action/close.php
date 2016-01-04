<?php
/** @var \bbn\mvc\controller $this */
if ( isset($this->post['dir'], $this->post['file'], $this->post['editors']) ){
  $dir = new \bbn\ide\directories($this->inc->options);
  $dir->close($this->post['dir'], $this->post['file'], $this->post['editors'], $this->inc->pref);
  echo "1";
}