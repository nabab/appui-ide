<?php
/*
 * Describe what it does!
 *
 * @var $ctrl \bbn\Mvc\Controller
 *
 */
if ($ctrl->hasArguments()) {
  $ctrl->addData([
    'root' => $ctrl->pluginUrl('appui-ide'),
    'id' => $ctrl->arguments[0]
  ])
    ->combo('$title', true);
}