<?php

use bbn\X;
use bbn\Str;
/** @var $ctrl \bbn\Mvc\Controller */

if ($ctrl->hasArguments(2)) {
	$ctrl->addData(['lib' => $ctrl->arguments[0] . '/' . $ctrl->arguments[1]])->action();
}
