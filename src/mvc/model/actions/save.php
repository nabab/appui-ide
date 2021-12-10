<?php
/** @var \bbn\Mvc\Controller $ctrl */
if ( isset($model->inc->ide, $model->data['full_path']) ){
  return $model->inc->ide->save($model->data);
}
