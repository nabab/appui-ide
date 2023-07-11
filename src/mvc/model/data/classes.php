<?php
/**
 * What is my purpose?
 *
 **/

use bbn\X;
use bbn\Str;
use bbn\Parsers\Php;
/** @var $model \bbn\Mvc\Model*/

$fs = new bbn\File\System();
$parser = new Php();
$res = [
  'success' => false,
];
$library = [];
if ($model->hasData('lib')) {
  $fullpath = $model->libPath() . $model->data['lib'];
  $composer = $fs->scan($fullpath, function($a) {
    return strpos($a, "composer.json") !== false;
  });
  // X::ddump($composer);
  if ($composer) {
    $content = $fs->decodeContents($composer[0], null, true);
    if (isset($content['autoload'])) {
      $autoload = $content['autoload'];
      if ($content['autoload']['psr-4']) {
        $psr_value = $content['autoload']['psr-4'];
      }
      else if ($content['autoload']['psr-0']) {
        $psr_value = $content['autoload']['psr-0'];
      }
      $psr_keys = array_keys($psr_value);
      foreach($psr_keys as $namespace) {
        $libs = $parser->getLibraryClasses($fullpath . "/" . $psr_value[$namespace], $namespace);
        if ($libs) {
          $library = array_merge($library, $libs);
        }
      }
      $res['success'] = true;
    }
  }
  $res['data'] = $library;
}

return $res;
