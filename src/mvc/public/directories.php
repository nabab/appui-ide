<?php
/* @var $ctrl \bbn\mvc */
$ctrl->data = $ctrl->post;
$model = $ctrl->get_model()['ret'];

// If present a error show the error
if ( (count($model) === 1) && isset($model['error']) ){
  $ctrl->obj->error = $model['error'];
}
else{
  $ctrl->obj->data = $model;
}