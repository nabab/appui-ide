<?php
/**
 * What is my purpose?
 *
 **/

use bbn\X;
use bbn\Str;
/** @var $model \bbn\Mvc\Model*/

$id_path = $model->inc->options->fromCode("types", "ide", "appui");

if ($id_path) {
	$options_types = $model->inc->options->fullOptions($id_path);
  return [
    "types" => $options_types
  ];
}
