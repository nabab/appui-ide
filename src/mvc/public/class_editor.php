<?php

use bbn\X;
use bbn\Str;
/** @var $ctrl \bbn\Mvc\Controller */

if (!empty($ctrl->post)) {
  $ctrl->action();
}
else {
  $ctrl->combo(_("Class Editor"), true);
}
