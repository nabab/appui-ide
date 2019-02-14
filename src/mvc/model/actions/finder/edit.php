<?php


if ( !empty($model->data['node']) && 
    !empty($model->data['oldValue']) &&
    !empty($model->data['origin']) && 
    isset($model->data['path'])
  ){
   
  $success = false;
  $path = ( $model->data['path'] !== '/')  ? $model->data['path'] : '';
  $oldPath = $model->data['origin'].$path.$model->data['oldValue'];
//  die(var_dump(file_exists($oldPath), $oldPath));
  $system = new \bbn\file\system();
  
  $success = $system->rename($oldPath, $model->data['node']['value']);
	
  
  
  
  //$success = $system->copy($source,$dest);
  
  return [
    'success' => $success
    
  ];
}
