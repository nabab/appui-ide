<?php
/*
 * Describe what it does!
 *
 **/

/** @var $this \bbn\mvc\model*/

if ( !empty($model->data['path']) ){
  $success = false;
  $system = new \bbn\file\system($model->data['path']);
  $success = $system->delete($model->data['path'], true); 
  return [
    'success' => $success
  ];
}