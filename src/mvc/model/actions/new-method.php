<?php

use bbn\X;
use bbn\Str;
/** @var $model \bbn\Mvc\Model*/

$res = [
  'success' => false
];

if ($model->hasData(['root', 'lib', 'name', 'class', 'code', 'line'])) {
  $env = new appui\ide\Environment($model->data['root'], $model->data['lib']);
  $res = $env->create('method', $model->data);
}

return $res;