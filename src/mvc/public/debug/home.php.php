<?php
/*
 * Describe what it does!
 *
 * @var $ctrl \bbn\mvc\controller 
 *
 */
if (empty$ctrl->baseURL)) {
  $ctrl->set_url(APPUI_IDE_ROOT.'debug')->combo(_('Debug'));
}