<?php
/**
 * What is my purpose?
 *
 **/

use bbn\X;
use bbn\Str;
/** @var $model \bbn\Mvc\Model*/

return [
  'success' => true,
  'data' => $model->inc->ide->getRecentFiles()
];