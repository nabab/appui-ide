<?php

if ( isset($model->data['value']) &&
    isset($model->data['path']) &&
    !empty($model->data['destination'])
  ){
  $success = false;
  $path = $model->data['path'].$model->data['value'];
  $system = new \bbn\file\system2('nextcloud',  [
    'path' => $path,
    'host' => 'cloud.bbn.so',
    'user' => 'bbn',
    'pass' => 'bbnsolutionstest'
  ]);
  
  $success = $system->download($path, $model->data['destination'], $model->data['file']);
  return [
    'success' => true,
    'dest' => $model->data['destination']
  ];
}



