<?php

use bbn\X;
use bbn\Str;
/** @var $model \bbn\Mvc\Model*/

use bbn\Parsers\Php;

$parser = new Php();
if ($model->hasData('class')) {
  return [
    'data' => $parser->analyzeClass($model->data['class'])
  ];
}
else {
  return $model->getModel("./data/available-libraries");
}
