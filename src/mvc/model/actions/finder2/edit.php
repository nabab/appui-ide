<?php


if ( !empty($model->data['node']) && 
    !empty($model->data['oldValue']) &&
    isset($model->data['origin']) && 
    isset($model->data['path'])
  ){
  $success = false;
  $path = ( $model->data['path'] !== '/')  ? $model->data['path'] : '';
  $oldPath = $model->data['origin'].$path.$model->data['oldValue'];
  $system = new \bbn\file\system2('nextcloud',  [
    'path' => $path,
    'host' => 'cloud.bbn.so',
    'user' => 'bbn',
    'pass' => 'bbnsolutionstest'
  ]);
  
  $success = $system->rename($oldPath, $model->data['node']['value']);
	return [
    'success' => $success
    
  ];
}
