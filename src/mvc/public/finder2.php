<?php
/*
 * Describe what it does!
 *
 **/

/** @var $this \bbn\mvc\controller */
if ( isset($ctrl->post['data']['path']) ){
  $ctrl->action();
}
else{
  $ctrl->combo('Finder 2', true);
}