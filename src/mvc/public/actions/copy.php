<?php
/** @var $ctrl \bbn\mvc\controller */
if ( isset($ctrl->inc->ide) && !empty($ctrl->post) ){
  $ctrl->action();
}

