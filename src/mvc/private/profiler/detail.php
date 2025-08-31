<?php
/*
 * Describe what it does!
 *
 * @var bbn\Mvc\Controller $ctrl
 *
 */
if ($ctrl->hasArguments()) {
  $ctrl->addData([
    'root' => $ctrl->pluginUrl('appui-ide'),
    'id' => $ctrl->arguments[0]
  ])
    ->combo('$title', true);
}