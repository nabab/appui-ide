<?php
$res = ['success' => false];
if ( isset($model->data['state']) &&
  !empty($model->data['file']) &&
  isset($model->data['set_recent_file']) &&
  !empty($model->data['info'])
){
  $res['success'] = $model->inc->ide->set_opened_file($model->data['info'], $model->data['file'], $model->data['state'], $model->data['set_recent_file']);
}
return $res;
