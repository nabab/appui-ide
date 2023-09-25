<?php
/**
 * What is my purpose?
 *
 **/

use bbn\X;
use bbn\Str;
use bbn\Parsers\Generator;
/** @var $model \bbn\Mvc\Model*/

$resp = [
  'success' => false,
];

if ($model->hasData(['data', 'lib', 'class', 'method', 'root']))
{
  $env = new appui\ide\Environment($model->data['root'], $model->data['lib']);
  $resp = $env->modifyLibraryClass(
    $model->data['class'],
    $model->data['data'],
    $model->data['method']
  );
}

return $resp;