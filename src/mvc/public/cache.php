<?php
/*
 * Manages the cache entries
 *
 **/

/** @var bbn\Mvc\Controller $ctrl */

if (empty($ctrl->post)) {
  $ctrl->setColor('#391E13', '#FFF')
       ->setIcon('nf nf-md-cached')
       ->setData(['main' => 1])
       ->setObj(['scrollable' => false])
       ->combo("Cache management");
}
else {
  $ctrl->action();
}
