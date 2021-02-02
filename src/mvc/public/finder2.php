<?php
/*
 * Describe what it does!
 *
 **/

/** @var $this \bbn\Mvc\Controller */
if ( isset($ctrl->post['data']['path']) ){
  $ctrl->action();
}
else{
  $ctrl->combo('Finder 2', true);
}