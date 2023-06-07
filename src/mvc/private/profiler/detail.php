<?php
/*
 * Describe what it does!
 *
 * @var $ctrl \bbn\Mvc\Controller
 *
 */
if ($ctrl->hasArguments()) {
  $ctrl->addData([
    'root' => APPUI_IDE_ROOT,
    'id' => $ctrl->arguments[0]
  ])
    ->combo('$title', true);
}