<?php
/**
 * What is my purpose?
 *
 **/

use bbn\X;
use bbn\Str;
use bbn\Parsers\Php;
/** @var bbn\Mvc\Model $model */

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
