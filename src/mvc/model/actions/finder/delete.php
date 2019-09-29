<?php
/*
 * Describe what it does!
 *
 **/

/** @var $this \bbn\mvc\model*/

$success = false;

if (!empty($model->data['name']) && !empty($model->data['path']) && isset($model->inc->fs) && $model->inc->fs->check() ){
  $full_path =  ($model->data['path'] !== '.') ?  $model->data['path'].'/'.$model->data['name'] : $model->data['name'];
  
  // blocked we had to restore the backup of thomas.lan
  if ( $model->inc->fs->get_mode() === 'nextcloud' ){
    $success = $model->inc->fs->delete($full_path, true); 
  }
}
return [
  'success' => $success
];