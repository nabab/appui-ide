<?php

use bbn\X;
use bbn\Str;
/** @var $model \bbn\Mvc\Model*/

$res = [
  "success" => false,
];


if ($model->hasData(['lib', 'class', 'root'])) {
  $env = new appui\ide\Environment($model->data['root'], $model->data['lib']);
  $res = $env->getAvailableTests($model->data['class']);
}

return $res;