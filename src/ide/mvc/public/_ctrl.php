<?php
/** @var $this \bbn\mvc */
if ( !isset($this->inc->pref) ){
  die("Preferences must be set up for the IDE module to load");
}
$this->inc->pref->set_user($this->inc->user->get_id());
return 1;