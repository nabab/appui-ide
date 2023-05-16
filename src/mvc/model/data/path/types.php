<?php
/**
 * What is my purpose?
 *
 **/

use bbn\X;
use bbn\Str;
/** @var $model \bbn\Mvc\Model*/

return [
    "types" => $model->inc->options->fullOptionsByCode('types', 'ide', 'appui')
];
