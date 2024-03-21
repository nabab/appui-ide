<?php
/*
 * Manages the cache entries
 *
 **/

/** @var $ctrl \bbn\Mvc\Controller */

if (empty($ctrl->post)) {
  $ctrl->setColor('#391E13', '#FFF')->setIcon('nf nf-mdi-cached')->combo("Cache management");
}
else {
  $ctrl->action();
}
