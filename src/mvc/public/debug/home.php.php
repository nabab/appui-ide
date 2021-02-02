<?php
/*
 * Describe what it does!
 *
 * @var $ctrl \bbn\Mvc\Controller 
 *
 */
if (empty$ctrl->baseURL)) {
  $ctrl->setUrl(APPUI_IDE_ROOT.'debug')->combo(_('Debug'));
}