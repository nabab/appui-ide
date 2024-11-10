<?php
/**
 * What is my purpose?
 *
 **/

use bbn\X;
use bbn\Str;
/** @var bbn\Mvc\Model $model */

return [
  'success' => true,
  'data' => $model->inc->ide->getRecentFiles()
];