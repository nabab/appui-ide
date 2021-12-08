<?php

/** @var $this \bbn\Mvc\Model*/

if ( !empty($model->data['path']) ){
  $success = false;
  $system = new \bbn\File\System($model->data['path']);
  if ( $system->exists($model->data['path'])){
    $success = $system->delete($model->data['path']); 
  }; 
  return [
    'success' => $success
  ];
}