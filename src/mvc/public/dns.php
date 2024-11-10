<?php

use bbn\X;
use bbn\Str;
/** @var bbn\Mvc\Controller $ctrl */

if (empty($ctrl->post)) {
  $ctrl->combo(_("DNS Tools"), true);
}
else {
  $ctrl->action();
}