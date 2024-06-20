<?php

use bbn\X;
use bbn\Str;
/** @var $ctrl \bbn\Mvc\Controller */

if ($ctrl->hasData('url')) {
	$ctrl->combo('History', true);
}