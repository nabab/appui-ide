<?php
/*
 * Describe what it does!
 *
 **/

/** @var $this \bbn\mvc\model*/
$file = $model->data_path().'logs/_php_error.json';
if ( $model->inc->fs->is_file($file) ){
  $json = json_decode(file_get_contents($file), true);
  return ['data' => $json];
}