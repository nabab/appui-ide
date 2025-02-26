<?php

use bbn\X;
use bbn\Str;
/** @var bbn\Mvc\Model $model */

$res = [
  "success" => false,
];


if ($model->hasData(['lib', 'class', 'root'])) {
  $env = new appui\ide\Environment($model->data['root'], $model->data['lib']);
  $res = $env->getAvailableTests($model->data['class']);
}

return $res;