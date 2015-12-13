<?php
/* @var $this \bbn\mvc */
$this->data = $this->post;
$model = $this->get_model()['ret'];

// If present a error show the error
if ( (count($model) === 1) && isset($model['error']) ){
  $this->obj->error = $model['error'];
}
else{
  $this->obj->data = $model;
}