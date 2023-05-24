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
if ($model->hasData('lib')) {
  $fullpath = $model->libPath() . $model->data['lib'];
  $composer = $fs->scan($fullpath, function($a) {
    return strpos($a, "composer.json") !== false;
  });
  if ($composer) {
    $content = $fs->decodeContents($composer[0], null, true);
    if (isset($content['autoload'])) {
      $autoload = $content['autoload'];
      $key = str_replace("/", "\\\\", $model->data['lib']);
      //$srcpath = $autoload['psr-4'][]
      
    /*	if ($libs = $parser->getLibraryClasses($fullpath, 'bbn')) {
        
      }*/

    }
    X::ddump($autoload, $key);
  }
}
//'library' => $parser->getLibraryClasses($model->libPath() . 'bbn/bbn/src/bbn', 'bbn'),

return $res;
