<?php
/*
 * Describe what it does!
 *
 **/

/** @var $model \bbn\Mvc\Model */
$profiler = new \bbn\Appui\Profiler($model->db);
return $profiler->getList($model->data);