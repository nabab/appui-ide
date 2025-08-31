<?php
/** @var bbn\Mvc\Controller $ctrl */
if ( isset($ctrl->inc->ide) && !empty($ctrl->post) ){
  $ctrl->action();
}

