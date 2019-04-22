<?php

if ( isset($model->data['origin']) && 
    !empty($model->data['node']) &&
    isset($model->data['new_dir']) && 
    isset($model->data['old_dir'])
  ){
  $success = false;
  $system = new \bbn\file\system2('nextcloud',  [
    'path' => $model->data['path'],
    'host' => 'cloud.bbn.so',
    'user' => 'bbn',
    'pass' => 'bbnsolutionstest'
  ]);
  
  $source = $model->data['origin'].$model->data['old_dir'].$model->data['node']['value'];
  $dest = $model->data['origin'].$model->data['new_dir'];
  
  $dest .= $model->data['node']['value'];
  
  if ( $system->exists($dest) ){
    $dest .= '(1)';
  }
  
  
  $success = $system->copy($source,$dest);
  
  return [
    'success' => true,
    'dest' => $dest
  ];
}



