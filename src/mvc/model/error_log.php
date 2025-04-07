<?php
use bbn\X;
use bbn\Str;
/** @var $model \bbn\Mvc\Model*/

$file = $model->tmpPath().'logs/_php_error.json';
if ( $model->inc->fs->isFile($file) ){
  $json = json_decode(file_get_contents($file), true);
  return ['data' => $json];
}
else {
  return ['data' => [], 'error' => X::_("No file")];
}
