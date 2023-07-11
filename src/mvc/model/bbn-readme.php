<?php
/**
 * What is my purpose?
 *
 **/

use bbn\X;
use bbn\Str;
/** @var $model \bbn\Mvc\Model*/

$file = $model->libPath()."bbn/bbn/README.md";
if (file_exists($file)) {
  return [
    'text' => Str::markdown2html(file_get_contents($file))
  ];
}