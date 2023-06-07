<?php
/**
 * What is my purpose?
 *
 **/

use bbn\X;
use bbn\Str;
use bbn\Parsers\Generator;
/** @var $model \bbn\Mvc\Model*/

if ($model->hasData("data")) {
	$x = new Generator($model->data["data"]);
  $res = $x->generateClass();
  return ['data' => $res, 'success' => true];
}