<?php
/**
 * What is my purpose?
 *
 **/

use bbn\X;
use bbn\Str;
use bbn\Parsers\Generator;
/** @var bbn\Mvc\Model $model */

$resp = [
  'success' => false,
];

if ($model->hasData(['data', 'lib', 'class', 'method', 'root']))
{
  $env = new appui\ide\Environment($model->data['root'], $model->data['lib']);
  $data = [
    'function' => $model->data['method'],
    'raw' => $model->data['data'],
  ];
  $resp = $env->modifyClassMethod(
    $model->data['class'],
    $data
  );
}

return $resp;