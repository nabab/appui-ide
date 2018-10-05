<?php
/** @var $ctrl \bbn\mvc\controller */
if ( !$ctrl->inc->user->is_dev() ){
  die(_("You aren't a developer user."));
}
if ( !isset($ctrl->inc->pref) ){
  die(_("Preferences must be set up for the IDE module to load."));
}
if ( !\defined('APPUI_IDE_ROOT') ){
  define('APPUI_IDE_ROOT', $ctrl->plugin_url('appui-ide').'/');
}
$ctrl->data['routes'] = $ctrl->get_routes();
$ctrl->data['shared_path'] = BBN_SHARED_PATH;

$ctrl->add_inc('ide', new \appui\ide(
  $ctrl->db,
  $ctrl->inc->options,
  $ctrl->data['routes'],
  $ctrl->inc->pref)
);
return 1;
