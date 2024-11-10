<?php

use bbn\X;
use bbn\Str;
/** @var bbn\Mvc\Model $model */

use bbn\Parsers\Php;
use bbn\Parsers\Generator;

$res = [
  "success" => false,
];

if ($model->hasData(['lib', 'root', 'class', 'function', 'code', 'libfunction'])) {
  $env = new appui\ide\Environment($model->data['root'], $model->data['lib']);
  $data = [
    'function' => $model->data['function'],
    'libfunction' => $model->data['libfunction'],
    'code' => $model->data['code'],
  ];
  $res = $env->modifyClassMethod(
    $model->data['class'],
    $data,
    'testclass'
  );
}

return $res;