<?php

use bbn\X;
use bbn\Str;
/** @var bbn\Mvc\Model $model */

$res = [
  'success' => false
];

/*

app => appPath
lib => libPath
data => dataPath
plugins/* => pluginPath(*)

*/

if ($model->hasData(['lib', 'class', 'root'])) {
  $env = new appui\ide\Environment($model->data['root'], $model->data['lib']);
  $res = $env->install();
}
return $res;