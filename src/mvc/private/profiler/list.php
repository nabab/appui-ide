<?php
/*
 * Describe what it does!
 *
 * @var bbn\Mvc\Controller $ctrl 
 *
 */
$ctrl->addData(['root' => $ctrl->pluginUrl('appui-ide').'/'])
  ->combo(_('List'), true);