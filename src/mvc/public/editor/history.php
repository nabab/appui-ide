<?php

use bbn\X;
use bbn\Str;
/** @var bbn\Mvc\Controller $ctrl */

if ($ctrl->hasData('url')) {
	$ctrl->combo('History', true);
}