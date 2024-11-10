<?php

/** @var bbn\Mvc\Model $model */
$profiler = new \bbn\Appui\Profiler($model->db);
return $profiler->getList($model->data);