<?php
/** @var $ctrl \bbn\Mvc\Controller */
if ( isset($ctrl->inc->ide) && !empty($ctrl->post) ){
  $ctrl->action();
}

