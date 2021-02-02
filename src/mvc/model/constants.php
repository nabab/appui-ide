<?php
/** @var $model \bbn\Mvc\Model */
if ( isset($model->data['name']) ){
  $cs = get_defined_constants();
  $res = [
    'prefix' => $model->data['name'],
    'constants' => []
  ];
  $prefix = $model->data['name'].'_';
  foreach ( $cs as $k => $c ){
    if ( strpos($k, $prefix) === 0 ){
      array_push($res['constants'], [
        'constant' => substr($k, Strlen($prefix)),
        'value' => $c
      ]);
    }
  }
  return $res;
}