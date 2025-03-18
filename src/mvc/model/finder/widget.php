<?php
use bbn\X;
use bbn\Str;
/** @var $model \bbn\Mvc\Model*/

$conn = $model->inc->pref->getAll($model->inc->options->fromCode('sources', 'finder', 'appui'));

return ["connections" => $conn];
