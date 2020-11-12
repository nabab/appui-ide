<?php
/** @var $ctrl \bbn\mvc\controller */

// One must be a dev to be here
if (!$ctrl->inc->user->is_dev()) {
  die("You aren't an admin user.");
}

// One must have preferences
if (!isset($ctrl->inc->pref)) {
  die("Preferences must be set up for the IDE module to load.");
}

if (!isset($ctrl->inc->ide)) {
  $ctrl->add_inc(
    'ide',
    new \bbn\appui\ide(
      $ctrl->db,
      $ctrl->inc->options,
      $ctrl->get_routes(),
      $ctrl->inc->pref,
      $ctrl->post['project'] ?? ''
    )
  );
}

if (!defined('APPUI_IDE_ROOT')) {
  $origin = $ctrl->inc->ide->get_origin();
  if ($origin === 'appui-projects') {
    define(
      'APPUI_IDE_ROOT',
      $ctrl->plugin_url($origin)
          .'/router/'.$ctrl->inc->ide->get_name_project()
          .'/'.$ctrl->plugin_url('appui-ide').'/'
    );
  }
  else {
    define('APPUI_IDE_ROOT', $ctrl->plugin_url('appui-ide').'/');
  }
}

$ctrl->add_inc('fs',  new \bbn\file\system());


return true;
