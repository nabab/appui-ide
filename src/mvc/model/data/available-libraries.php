<?php
/**
 * What is my purpose?
 *
 **/

use bbn\X;
use bbn\Str;
/** @var $model \bbn\Mvc\Model*/

$res = [
  'success' => false,
];

$res = appui\newide\Environment::getAvailableLibraries();

return $res;