<?php

use bbn\X;
use bbn\Str;
/** @var $model \bbn\Mvc\Model*/

$res = [
  'success' => false
];

if ($model->hasData(['root', 'lib', 'namespace', 'classname']))
{
  $env = new appui\ide\Environment($model->data['root'], $model->data['lib']);
  $res = $env->createNewClass($model->data['namespace'], $model->data['classname']);
}

return $res;