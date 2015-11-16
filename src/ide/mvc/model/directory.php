<?php
/** @var \bbn\mvc\model $this */
if ( isset($this->data['path']) ){
  $dirs = new \bbn\ide\directories($this->db);
  return $dirs->dir($this->data['path']);
}
