<?php

/** @var $this \bbn\Mvc\Model*/
if ( $model->data['path'] ){
  $system = new \bbn\File\System($model->data['path']);
  
}