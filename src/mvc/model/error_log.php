<?php
/*
 * Describe what it does!
 *
 **/

/** @var $this \bbn\Mvc\Model*/
$file = $model->dataPath().'logs/_php_error.json';
if ( $model->inc->fs->isFile($file) ){
  $json = json_decode(file_get_contents($file), true);
  return ['data' => $json];
}