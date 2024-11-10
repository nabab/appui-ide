<?php

use bbn\X;
use bbn\Str;
/** @var bbn\Mvc\Controller $ctrl */

if (!empty($ctrl->post)) {
  $ctrl->action();
}
else {
  $ctrl->combo("Recent Files", true);
}