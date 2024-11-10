<?php
/**
 * What is my purpose?
 *
 **/

use bbn\X;
use bbn\Str;
/** @var bbn\Mvc\Model $model */

$res = [
  'success' => false,
];

$res = appui\ide\Environment::getAvailableLibraries();

return $res;