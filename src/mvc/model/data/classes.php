<?php
/**
 * What is my purpose?
 *
 **/

use bbn\X;
use bbn\Str;
use bbn\Parsers\Php;
/** @var $model \bbn\Mvc\Model*/

$res = [
  'success' => false,
];
$library = [];
$root = false;

if ($model->hasData(['root', 'lib'])) {
  $env = new appui\ide\Environment($model->data['root'], $model->data['lib']);
  $res = $env->getLibraryClasses();
}

return $res;
