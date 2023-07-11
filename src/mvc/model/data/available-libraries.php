<?php
/**
 * What is my purpose?
 *
 **/

use bbn\X;
use bbn\Str;
/** @var $model \bbn\Mvc\Model*/

$fs = new bbn\File\System();
$fs->cd($model->libPath());
$composers = $fs->scan(".", function($a) {
  return strpos($a, "composer.json") !== false;
});
$res = [
  'success' => false,
];
if ($composers) {
  $res['success'] = true;
  $res['libraries'] = [];
  foreach($composers as $c) {
		if (!$fs->isDir(dirname($c).'/.git')) {
      continue;
    }
    $content = $fs->decodeContents($c, null, true);
    if (isset($content['autoload'])) {
      $bits = X::split($c, "/");
      $lib = $bits[0] . "/" . $bits[1];
      $libpath = $model->libPath() . $lib;
      $libgit = $libpath . "/.git";
      if (in_array($libgit, $fs->scand($libpath, true), true)) {
        $res['libraries'][] = $lib;
      }
    }
  }
}
return $res;