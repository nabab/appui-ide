<?php

$success = false;


if ( !empty($model->data['node']['value']) && !empty($model->data['oldValue']) && isset($model->inc->fs) && $model->inc->fs->check() ){
  if ( strpos($model->data['path'], './') === 0 ){
    $model->data['path'] = '/';
  }
  $success = $model->inc->fs->rename($model->data['path'].$model->data['oldValue'], $model->data['node']['value'], true); 
}
return [
  'success' => $success
];