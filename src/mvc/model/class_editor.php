<?php

use bbn\X;
use bbn\Str;
/** @var $model \bbn\Mvc\Model*/

use bbn\Parsers\Php;

$parser = new Php();
return [
  'data' => $parser->analyzeClass('bbn\Appui\Project')
];

//test