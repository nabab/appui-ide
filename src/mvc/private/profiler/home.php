<?php

use bbn\X;
use bbn\Str;
/** @var bbn\Mvc\Controller $ctrl */

$fs = new bbn\File\System();

function getProfiling() {
  $profiling = "";
  if (defined('BBN_PROFILING')) {
    $profiling = BBN_PROFILING;
  }
  return $profiling;
}

function changeProfiling($ctrl, $fs, string $profiling) {
  $settings_file = $ctrl->appPath()."cfg/settings.json";
  $settings = json_decode($fs->getContents($settings_file));
  var_dump($settings_file);
  var_dump($settings);
  $settings->profiling = $profiling;
  var_dump($settings);
  $fs->putContents($settings_file, json_encode($settings, true));
}

$profiling = getProfiling();

//changeProfiling($ctrl, $fs, "gitignore-generator");

//$ctrl->combo("Home", ['profiling' => $profiling]);

if (empty($ctrl->post)) {
  $ctrl->combo("Home", ['profiling' => $profiling]);
}
else {
  if (!empty($ctrl->post['profiling'])) {
    changeProfiling($ctrl, $fs, $ctrl->post['profiling']);
  }
  $profiling = getProfiling();
  return $profiling;
}
