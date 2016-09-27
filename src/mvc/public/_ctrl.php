<?php
/** @var $ctrl \bbn\mvc */
if ( !isset($ctrl->inc->pref) ){
  die("Preferences must be set up for the IDE module to load");
}
$ctrl->inc->pref->set_user($ctrl->inc->user->get_id());
$ctrl->data['root'] = $ctrl->plugin_url('appui-ide').'/';
$ctrl->data['routes'] = $ctrl->get_routes();
return 1;