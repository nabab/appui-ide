<?php

use bbn\X;
use bbn\Str;
/** @var $model \bbn\Mvc\Model*/

$res = [
  'success' => false
];

$fs = new bbn\File\System();

if ($model->hasData('lib')) {
  try {
    $dir = $model->dataPath("appui-ide") . "class_editor/" . $model->data['lib'] . "/";
    if (file_exists($dir)) {
      $fs->delete($dir, true);
      $res["success"] = true;
    }
  }
  catch (Exception $e) {
    $res["error"] = $e->getMessage();
  }
}
return $res;