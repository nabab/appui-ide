<?php

/** @var $this \bbn\Mvc\Model*/

use bbn\X;

$success = false;

if (!empty($model->data['name']) && !empty($model->data['path']) && isset($model->inc->finderfs) && $model->inc->finderfs->check() ){
  $full_path =  ($model->data['path'] !== '.') ?  $model->data['path'].'/'.$model->data['name'] : $model->data['name'];
  
   $success = $model->inc->finderfs->delete($full_path, true);
}
return [
  'success' => $success
];