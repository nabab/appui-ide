<?php
use bbn\X;
use bbn\Str;
/** @var bbn\Mvc\Model $model */

$file = $model->dataPath().'logs/_php_error.json';
if ( $model->inc->fs->isFile($file) ){
  $json = json_decode(file_get_contents($file), true);
  return ['data' => array_values($json['data'])];
}
else {
  return ['data' => [], 'error' => X::_("No file")];
}
