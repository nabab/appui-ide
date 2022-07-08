<?php

use bbn\X;
/** @var $ctrl \bbn\Mvc\Controller */
if ( count($ctrl->arguments) ){
  $ctrl->addToObj('ide/sandbox/test/'.implode('/', $ctrl->arguments), $ctrl->post, true);
}