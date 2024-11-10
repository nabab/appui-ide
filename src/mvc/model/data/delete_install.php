<?php

use bbn\X;
use bbn\Str;
/** @var bbn\Mvc\Model $model */

$res = [
  'success' => false
];

if ($model->hasData(['lib', 'root'])) {
  $env = new appui\ide\Environment($model->data['root'], $model->data['lib']);
  $res = $env->delete();
}
return $res;