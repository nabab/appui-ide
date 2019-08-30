<?php
$success = false;
$size = false;
 
if ( !empty($model->data['origin']) && isset($model->data['path'])){
  $size = \bbn\str::say_size($model->inc->fs->dirsize($model->data['path']));
  if ( isset($size) ){
    $success = true;
  };
}
return [
  'success' => $success,
  'size' => $size,
];