<?php

use bbn\X;
use bbn\Str;
/** @var bbn\Mvc\Model $model */

$res = [
  'success' => false,
];
$arr = [];
$files = $model->inc->ide->getRecentFiles();
if ( !empty($files) ) {
  $res['files'] = $files;
  if ( !empty($res['files']) ){
    $res['success'] = true;
    $files = $res['files'];
    foreach($files as $file)  {
      //X::ddump($model->inc->ide->realToUrl($file['file']));
      if (!X::getRow($arr, $file)) {
        array_push($arr, $file);
      }
    }
    $res['files'] = $arr;
  }
}
return $res;