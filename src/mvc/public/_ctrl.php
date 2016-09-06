<?php
/** @var $ctrl \bbn\mvc */
if ( !isset($ctrl->inc->pref) ){
  die("Preferences must be set up for the IDE module to load");
}
$ctrl->inc->pref->set_user($ctrl->inc->user->get_id());
return 1;