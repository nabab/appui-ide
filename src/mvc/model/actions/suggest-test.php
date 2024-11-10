<?php

use bbn\X;
use bbn\Str;
use bbn\Appui\Ai;
/** @var bbn\Mvc\Model $model */

$res = [
  'success' => false
];

if ($model->hasData(['lib', 'root', 'function_code'])) {
	$ai = new Ai($model->db);
  $env = new appui\ide\Environment($model->data['root'], $model->data['lib']);
  $res = $env->makeAiRequest('suggest-test', $ai, $model->data['function_code']);
}


return $res;