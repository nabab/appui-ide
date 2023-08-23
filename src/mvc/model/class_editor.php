<?php

use bbn\X;
use bbn\Str;
/** @var $model \bbn\Mvc\Model*/

use bbn\Parsers\Php;

//X::ddump($model->pluginPath('appui-newide'));

$parser = new Php();
if ($model->hasData('class')) {
  if ($model->hasData('lib')) {
    $dir = $model->dataPath("appui-newide") . "class_editor/" . $model->data['lib'] . "/lib/";
    if (file_exists($dir)) {
      $cfg = [
        'class' => $model->data['class'],
        'lib' => $model->data['lib'],
        'dir' => $dir
      ];
      $router = $model->pluginPath('appui-newide') . 'cfg/router-alt.php';
      $output = shell_exec(sprintf('php -f %s %s "%s"',
                         $router,
                         'class-testor',
                         bbn\Str::escapeDquotes(json_encode($cfg))
                        ));
      $data = $output ? json_decode($output, true) : [];
    } else {
      return $model->getModel("./data/available-libraries");
    }
  }
  return [
    'data' => $data
  ];
}
else {
  return $model->getModel("./data/available-libraries");
}
