<?php
/*
 * Describe what it does!
 *
 * @var $ctrl \bbn\Mvc\Controller 
 *
 */
if (defined('BBN_BASEURL') && empty(BBN_BASEURL)) {
  $ctrl->setUrl(APPUI_IDE_ROOT.'debug')->combo(_('Debug'));
}