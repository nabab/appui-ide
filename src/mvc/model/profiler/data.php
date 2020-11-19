<?php
/*
 * Describe what it does!
 *
 **/

/** @var $model \bbn\mvc\model */
$profiler = new \bbn\appui\profiler($model->db);
return $profiler->get_list($model->data);