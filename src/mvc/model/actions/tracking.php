<?php
$res = ['success' => false];
if ( isset($model->data['state']) &&
  !empty($model->data['file']) &&
  !empty($model->data['id_repository']) && 
  isset($model->data['set_recent_file']) 
){
  $res['success'] = $model->inc->ide->set_opened_file($model->data['id_repository'], $model->data['file'], $model->data['state'], $model->data['set_recent_file']);
}
return $res;
