<?php

use bbn\X;
use bbn\Str;
/** @var $ctrl \bbn\Mvc\Controller */

if (!empty($ctrl->post)) {
  $ctrl->action();
}
elseif (!empty(BBN_BASEURL) && $ctrl->hasArguments(4)) {
  $ctrl->add('./class_editor_cp', [
    'root' => $ctrl->arguments[0],
    'lib' => $ctrl->arguments[1] . '/' . $ctrl->arguments[2],
    'class' => $ctrl->arguments[3]
  ], true);
}
else {
  $ctrl->setUrl($ctrl->pluginUrl("appui-ide")."/class_editor")->combo(_("Class Editor"), true, 0);
}
