<?php

use bbn\X;
use bbn\Str;
/** @var $model \bbn\Mvc\Model*/

$res = [
  'success' => false
];

if ($model->hasData(['root', 'lib', 'name', 'class', 'code'])) {
  $env = new appui\ide\Environment($model->data['root'], $model->data['lib']);
  $res = $env->create('property', $model->data);
}

return $res;