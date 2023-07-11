<?php

use bbn\X;
use bbn\Str;
/** @var $model \bbn\Mvc\Model*/

$res = [
  'success' => false
];

if ($model->hasData('lib')) {
  try {
    $dir = $model->dataPath("appui-ide") . "class_editor/" . $model->data['lib'] . "/";
    if (file_exists($dir)) {
      $res["success"] = true;
      $res["found"] = true;
    }
    else {
    	$res["success"] = true;
      $res["found"] = false;
    }
  }
  catch (Exception $e) {
    $res["error"] = $e->getMessage();
  }
}
return $res;