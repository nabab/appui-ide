<?php

/** @var $this \bbn\Mvc\Model*/

if ( !empty($model->data['path'], $model->inc->fs) ){
  $success = false;
  
  $system = new \bbn\File\System('nextcloud',  [
    'path' => $model->data['path'],
    'host' => 'cloud.bbn.so',
    'user' => 'bbn',
    'pass' => 'bbnsolutionstest'
  ]);
  $success = $system->delete($model->data['path'], true); 
  return [
    'success' => $success
  ];
}