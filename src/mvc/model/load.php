<?php
if ( !empty($this->data['file']) && !empty($this->data['dir']) && isset($this->data['routes']) ){
  $dirs = new \bbn\ide\directories($this->inc->options, $this->data['routes']);
  if ( $res = $dirs->load($this->data['file'], $this->data['dir'], (isset($this->data['tab']) ? $this->data['tab'] :
    false), $this->inc->pref) ){
    return $res;
  }
  return ['error' => $dir->get_last_error()];
}
