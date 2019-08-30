<?php
/*
 * Describe what it does!
 *
 **/

/** @var $this \bbn\mvc\model*/

$success = false;

if ( !empty($model->data['path']) && isset($model->inc->fs) && $model->inc->fs->check() ){
  // blocked we had to restore the backup of thomas.lan
  if ( $model->inc->fs->get_mode() === 'nextcloud' ){
    $success = $model->inc->fs->delete($model->data['path'], true); 
  }
}
return [
  'success' => $success
];