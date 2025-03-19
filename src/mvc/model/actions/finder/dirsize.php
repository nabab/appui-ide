<?php
$success = false;
$size = false;
 
if ( !empty($model->data['origin']) && isset($model->data['path'])){
  $size = \bbn\Str::saySize($model->inc->fs->dirsize($model->data['path']));
  if ( isset($size) ){
    $success = true;
  };
}
return [
  'success' => $success,
  'size' => $size,
];