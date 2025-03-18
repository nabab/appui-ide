<?php
/**
 * What is my purpose?
 *
 **/

use bbn\X;
use bbn\Str;
/** @var $model bbn\Mvc\Model */

if ($model->hasData('path', true)) {
  $system = new \bbn\File\System($model->data['path']);
 
}
