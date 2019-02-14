<?php
/*
 * Describe what it does!
 *
 **/

/** @var $this \bbn\mvc\controller */
if ( isset($ctrl->post['path']) ){
  $ctrl->action();
}
else{
  $ctrl->combo('Finder', true);
}