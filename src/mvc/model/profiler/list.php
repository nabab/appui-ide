<?php

/** @var bbn\Mvc\Model $model */
$profiler = new \bbn\Appui\Profiler($model->db);
return [
  'root' => $model->data['root'],
  'urls' => $profiler->getUrls()
];