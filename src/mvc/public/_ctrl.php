<?php
/** @var $ctrl \bbn\mvc\controller */
if ( !$ctrl->inc->user->is_admin() ){
  die("You aren't an admin user.");
}
if ( !isset($ctrl->inc->pref) ){
  die("Preferences must be set up for the IDE module to load.");
}
if ( !defined('APPUI_IDE_ROOT') ){
  define('APPUI_IDE_ROOT', $ctrl->plugin_url('appui-ide').'/');
}
$ctrl->data['routes'] = $ctrl->get_routes();
$ctrl->data['shared_path'] = BBN_SHARED_PATH;

$ctrl->add_inc('ide', new \ide($ctrl->inc->options, $ctrl->data['routes'], $ctrl->inc->pref));

bindtextdomain('appui_ide', BBN_LIB_PATH.'bbn/appui-ide/src/locale');
setlocale(LC_ALL, "fr_FR.utf8");
textdomain('appui_ide');

return 1;