<?php

use bbn\X;
use bbn\Str;
/** @var $model \bbn\Mvc\Model*/

use bbn\Parsers\Php;
use bbn\Parsers\Generator;

$res = [
  "success" => false,
];

if ($model->hasData(['lib', 'root', 'class', 'function', 'code', 'libfunction'])) {
  $env = new appui\ide\Environment($model->data['root'], $model->data['lib']);
  $res = $env->modifyTestClass(
    $model->data['class'],
    $model->data['function'],
    $model->data['code'],
    $model->data['libfunction']
  );
}

return $res;