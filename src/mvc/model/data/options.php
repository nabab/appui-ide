<?php
/**
 * What is my purpose?
 *
 **/

$pathId = $model->data['pathId'];
$options = $model->inc->options->option($pathId);

return [
  "path_id" => $pathId,
  "options" => $options
];
