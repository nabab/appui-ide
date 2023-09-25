<?php

use bbn\X;
use bbn\Str;
/** @var $ctrl \bbn\Mvc\Controller */

if (!empty($ctrl->post)) {
  $ctrl->action();
}
else {
  $ctrl->setUrl($ctrl->pluginUrl("appui-ide")."/class_editor")->combo(_("Class Editor"), true, 0);
}
