<?php
/*
 * Describe what it does!
 *
 * @var $ctrl \bbn\mvc\controller
 *
 */
if ($ctrl->has_arguments()) {
  $ctrl->add_data([
    'root' => APPUI_IDE_ROOT,
    'id' => $ctrl->arguments[0]
  ])
    ->combo('$title', true);
}