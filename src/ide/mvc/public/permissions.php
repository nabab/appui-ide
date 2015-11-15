<?php
/* @var $this \bbn\mvc */
$mgr = new \apst\manager($this->inc->user, $this->get_model('permissions'));
$this->obj->data = $mgr->groups();
