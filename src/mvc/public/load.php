<?php
/** @var $this \bbn\mvc\controller */

if ( isset($this->post['dir']) ){
  $this->data = $this->post;
}
if ( $this->obj->data = $this->get_model() ){
  if ( !empty($this->obj->data['error']) ){
    $this->obj->error = $this->obj->data['error'];
  }
  else{
    if ( !empty($this->obj->data['def']) ){
      $this->obj->url = $this->obj->data['url'].'/'.$this->obj->data['def'];
    }
    else{
      $this->obj->url = $this->obj->data['url'];
    }
    $list = $this->inc->session->get('ide', 'list');
    $r = [
      'dir' => $this->data['dir'],
      'file' => $this->data['file']
    ];
    if ( !in_array($list, $r) ){
      array_push($list, $r);
      $this->inc->session->set($list, 'ide', 'list');
    }
  }
}