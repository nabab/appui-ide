<?php
/** @var $this \bbn\mvc\controller */

if ( isset($this->post['dir']) ){
  $this->data = $this->post;
}
if ( !empty($this->data['file']) && !empty($this->data['dir']) ){

  $dir = new \bbn\ide\directories($this->inc->options);

  if ( $this->obj->data = $dir->load($this->data['file'], $this->data['dir'], $this->inc->pref) ){

    if ( !empty($this->obj->data['def']) ){
      $this->obj->url = $this->obj->data['url'].'/'.$this->obj->data['def'];
    }
    else{
      $this->obj->url = $this->obj->data['url'];
    }
  }
  else{
    $this->obj->error = $dir->get_last_error();
  }
}