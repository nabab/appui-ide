<?php
use bbn\X;
use bbn\Str;
/** @var bbn\Mvc\Model $model*/

$conn = $model->inc->pref->getAll($model->inc->options->fromCode('sources', 'finder', 'appui'));

return ["connections" => $conn];
