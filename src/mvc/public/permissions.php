<?php
/* @var $ctrl \bbn\mvc */
$mgr = new \bbn\manager($ctrl->inc->user, $ctrl->get_model('permissions'));
$ctrl->obj->data = $mgr->groups();
