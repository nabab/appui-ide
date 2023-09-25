<?php

use bbn\X;
use bbn\Str;
/** @var $ctrl \bbn\Mvc\Controller */

if ($ctrl->hasArguments(2)) {
	$ctrl->addData(['root' => $ctrl->arguments[0], 'lib' => $ctrl->arguments[1] . (!empty($ctrl->arguments[2]) ? '/' . $ctrl->arguments[2] : '')])->cachedAction(24*3600);
}
