<?php
/*
 * Describe what it does!
 *
 **/

/** @var $this \bbn\mvc\model*/

if ( !empty($model->data['path'], $model->inc->fs) ){
  $success = false;
  
  $system = new \bbn\file\system('nextcloud',  [
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