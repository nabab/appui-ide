<?php
/* @var $ctrl \bbn\Mvc */
$mgr = new \bbn\manager($ctrl->inc->user, $ctrl->getModel('permissions'));
$ctrl->obj->data = $mgr->groups();
