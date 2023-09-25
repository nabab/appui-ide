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

$res = appui\ide\Environment::getAvailableLibraries();

return $res;