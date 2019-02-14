<?php
/*
 * Describe what it does!
 *
 **/

/** @var $this \bbn\mvc\model*/
if ( $model->data['path'] ){
  $system = new \bbn\file\system($model->data['path']);
  
}