<?php

use bbn\X;
use bbn\Str;
/** @var bbn\Mvc\Controller $ctrl */

if ($ctrl->hasArguments(2)) {
	//$ctrl->addData(['root' => $ctrl->arguments[0], 'lib' => $ctrl->arguments[1] . (!empty($ctrl->arguments[2]) ? '/' . $ctrl->arguments[2] : '')])->cachedAction(1);
	$ctrl->addData(['root' => $ctrl->arguments[0], 'lib' => $ctrl->arguments[1] . (!empty($ctrl->arguments[2]) ? '/' . $ctrl->arguments[2] : '')])->action();
}
