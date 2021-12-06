<?php
/** @var $ctrl \bbn\Mvc\Controller */

// One must be a dev to be here
if (!$ctrl->inc->user->isDev()) {
  die("You aren't an admin user.");
}

// One must have preferences
if (!isset($ctrl->inc->pref)) {
  die("Preferences must be set up for the IDE module to load.");
}


if (!isset($ctrl->inc->ide)) {
  $ctrl->addInc(
    'ide',
    new \bbn\Appui\Ide(
      $ctrl->db,
      $ctrl->inc->options,
      $ctrl->getRoutes(),
      $ctrl->inc->pref,
      $ctrl->post['project'] ?? ''
    )
  );
}

if (!defined('APPUI_IDE_ROOT')) {
  $origin = $ctrl->inc->ide->getOrigin();
  if ($origin === 'appui-project') {
    define(
      'APPUI_IDE_ROOT',
      $ctrl->pluginUrl($origin)
          .'/router/'.$ctrl->inc->ide->getNameProject()
          .'/'.$ctrl->pluginUrl('appui-ide').'/'
    );
  }
  else {
    define('APPUI_IDE_ROOT', $ctrl->pluginUrl('appui-ide').'/');
  }
}

if (!isset($ctrl->inc->fs)) {
  $ctrl->addInc('fs',  new \bbn\File\System());
}



return true;
