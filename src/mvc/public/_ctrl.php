<?php
/** @var $ctrl \bbn\mvc\controller */
if ( !$ctrl->inc->user->is_admin() ){
  die("You aren't an admin user.");
}
if ( !isset($ctrl->inc->pref) ){
  die("Preferences must be set up for the IDE module to load.");
}
$ctrl->inc->pref->set_user($ctrl->inc->user->get_id());
$ctrl->data['root'] = $ctrl->plugin_url('bbn-ide').'/';
$ctrl->data['routes'] = $ctrl->get_routes();
$ctrl->add_inc('ide', new \ide($ctrl->inc->options, $ctrl->data['routes'], $ctrl->inc->pref));
return 1;