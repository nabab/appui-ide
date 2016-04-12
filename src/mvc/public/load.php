<?php
/** @var $this \bbn\mvc\controller */

if ( isset($this->post['dir']) ){
  $this->data = $this->post;
}
$this->data['routes'] = $this->mvc->get_routes();
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
    if ( !in_array($this->obj->data['url'], $list) ){
      array_push($list, $this->obj->data['url']);
      $this->inc->session->set($list, 'ide', 'list');
    }
  }
}