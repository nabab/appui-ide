<?php

if (!empty($model->data['node']) &&
    isset($model->data['new_dir']) && 
    isset($model->data['old_dir']) &&
    isset($model->data['origin'])
  ){
  $success = false;
  
  $source = $model->data['old_dir'].$model->data['node']['value'];
  $dest = $model->data['new_dir'].$model->data['node']['value'];
  
  if ( $model->inc->fs->exists($dest) ){
    $dest .= '(1)';
  }
  
  
  $success = $model->inc->fs->copy($source,$dest);
  
  return [
    'success' => true,
    'dest' => $dest
  ];
}



