<?php
/**
 * What is my purpose?
 *
 **/

use bbn\X;
use bbn\Str;
/** @var bbn\Mvc\Model $model */

return [
    "types" => $model->inc->options->fullOptionsByCode('types', 'ide', 'appui')
];
