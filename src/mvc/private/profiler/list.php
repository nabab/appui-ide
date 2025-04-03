<?php
/*
 * Describe what it does!
 *
 * @var $ctrl \bbn\Mvc\Controller 
 *
 */
$ctrl->addData(['root' => $ctrl->pluginUrl('appui-ide').'/'])
  ->combo(_('List'), true);