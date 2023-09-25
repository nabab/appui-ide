<?php

use bbn\X;
use bbn\Str;
/** @var $model \bbn\Mvc\Model*/

$res = [
  'success' => false
];

if ($model->hasData(['lib', 'root'])) {
  $env = new appui\ide\Environment($model->data['root'], $model->data['lib']);
  $res = $env->check();
}
return $res;