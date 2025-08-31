<?php
/** @var bbn\Mvc\Model $model */
if ( isset($model->inc->ide, $model->data['full_path']) ){
  return $model->inc->ide->save($model->data);
}
