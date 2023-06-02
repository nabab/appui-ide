<?php

use bbn\X;
use bbn\Str;
/** @var $model \bbn\Mvc\Model*/

use bbn\Parsers\Php;

$parser = new Php();
if ($model->hasData('class')) {
  $data = $parser->analyzeClass($model->data['class']);
  if ($model->hasData('lib')) {
    $data['lib'] = $model->data['lib'];
  }
  return [
    'data' => $data
  ];
}
else {
  return $model->getModel("./data/available-libraries");
}
