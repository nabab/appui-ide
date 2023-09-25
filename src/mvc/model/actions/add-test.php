<?php

use bbn\X;
use bbn\Str;
/** @var $model \bbn\Mvc\Model*/

$res = [
  'success' => false
];


if ($model->hasData(['root', 'lib', 'class', 'tests']))
{
  $env = new appui\ide\Environment($model->data['root'], $model->data['lib']);
  $res = $env->addTestMethodsToClass($model->data['tests'], $model->data['class']);
}

return $res;