<?php

use bbn\X;
use bbn\Str;
use bbn\Appui\Ai;
/** @var $model \bbn\Mvc\Model*/

$res = [
  'success' => false
];

if ($model->hasData(['lib', 'root', 'function_code'])) {
	$ai = new Ai($model->db);
  $env = new appui\ide\Environment($model->data['root'], $model->data['lib']);
  $res = $env->makeAiRequest('ai-refactoring', $ai, $model->data['function_code']);
}


return $res;