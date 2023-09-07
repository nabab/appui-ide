<?php

use bbn\X;
use bbn\Str;
/** @var $model \bbn\Mvc\Model*/

use bbn\Parsers\Php;

//X::ddump($model->pluginPath('appui-newide'));

$parser = new Php();
if ($model->hasData(['class', 'lib', 'root'])) {
  $env = new appui\newide\Environment($model->data['root'], $model->data['lib']);
  $folder = $model->data['root'] !== 'app' ? "/" . $model->data['lib'] : '';
  $dir = $model->dataPath("appui-newide") . "class_editor/" . $model->data['root'] . $folder . "/_env";
  //if there’s  test environment we get the class informations from there
  if (is_dir($dir)) {
    $cfg = [
      'operation' => 'analyzeClass',
      'class' => $model->data['class'],
      'lib' => $model->data['lib'],
      'dir' => $dir
    ];
    $data = $env->execute($cfg);
  }
  //otherwise we get it from its original location
  else {
    $data = $parser->analyzeClass($model->data['class']);
    $data['lib'] = $model->data['lib'];
  }
  return [
    'data' => $data
  ];
}
else {
  return $model->getModel("./data/available-libraries");
}
