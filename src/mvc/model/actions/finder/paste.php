<?php

use bbn\X;

if (!empty($model->data['node']) &&
    isset($model->data['new_dir']) && 
    isset($model->data['old_dir']) &&
    isset($model->data['origin'])
  ){
  $success = false;

  $source = (($model->data['old_dir'] !== '.') ? $model->data['old_dir'].'/' : '' ) .$model->data['node']['value'];
  $dest = $model->data['new_dir'].$model->data['node']['value'];
  $tmp = X::pathinfo($dest);
  $i = 1;
  while ( $model->inc->finderfs->exists($dest) ){
    $dest = $dest = $tmp['dirname'] . '/' . $tmp['filename'] . ' (' . $i . ')' . '.' . $tmp['extension'];
    $i += 1;
  }


  $success = $model->inc->finderfs->copy($source, $dest);

  return [
    'success' => $success,
    'dest' => $dest,
  ];
}



