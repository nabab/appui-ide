<?php
/* @var $this \bbn\mvc */
$mgr = new \bbn\manager($this->inc->user, $this->get_model('permissions'));
$this->obj->data = $mgr->groups();
