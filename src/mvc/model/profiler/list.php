<?php
/*
 * Describe what it does!
 *
 **/

/** @var $model \bbn\mvc\model*/
$profiler = new \bbn\appui\profiler($model->db);
return [
  'root' => $model->data['root'],
  'urls' => $profiler->get_urls()
];