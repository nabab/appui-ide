<?php
/*
 * Describe what it does!
 *
 **/

/** @var $this \bbn\mvc\model*/

if ( !empty($model->data['path']) ){
  $success = false;
  
  $system = new \bbn\file\system2('nextcloud',  [
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