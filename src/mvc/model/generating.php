<?php
/**
 * What is my purpose?
 *
 **/

use bbn\X;
use bbn\Str;
use bbn\Parsers\Generator;
/** @var $model \bbn\Mvc\Model*/

$resp = [
  'success' => false,
];

$fs = new bbn\File\System();
$parser = new bbn\Parsers\Php();

if ($model->hasData("data")
    && $model->hasData("lib")
    && $model->hasData("class")
    && $model->hasData("method"))
{
  try {
    $lib = $model->data["lib"];
    $cur_class = $model->data["class"];
    $modified_data = $model->data["data"];
    $method = $model->data["method"];
    $dir = $model->dataPath("appui-newide") . "class_editor/" . $lib . "/lib/";
    $cfg = [
      'class' => $cur_class,
      'lib' => $lib,
      'dir' => $dir
    ];
    $router = $model->pluginPath('appui-newide') . 'cfg/router-alt.php';
    $output = shell_exec(sprintf('php -f %s %s "%s"',
                                 $router,
                                 'class-testor',
                                 bbn\Str::escapeDquotes(json_encode($cfg))
                                ));
    $data = $output ? json_decode($output, true) : [];
    if (!empty($data)) {
      $data['methods'][$method] = $modified_data;
      $parse = $parser->analyzeClass($cur_class);
      $x = new Generator($data);
      $res = $x->generateClass();
      //X::ddump($res);
      $composer = $dir . "composer.json";
      if (file_exists($composer)) {
        $content = $fs->decodeContents($composer, null, true);
        $test_path = "";
        if (isset($content['autoload-dev'])) {
          $autoload = $content['autoload'];
          if ($autoload['psr-4']) {
            $psr_value = $autoload['psr-4'];
          }
          else if ($autoload['psr-0']) {
            $psr_value = $autoload['psr-0'];
          }
          $psr_keys = array_keys($psr_value);
          if (sizeof($psr_keys) == 1) {
            $libnamespace = $psr_keys[0];
            $test_path = $psr_value[$libnamespace];
          }
        }
      }
      $class_split = X::split($cur_class, "\\");
      array_shift($class_split);
      $last_key = end(array_keys($class_split));
      $cur_class = "";
      foreach($class_split as $key => $value) {
        $cur_class = $cur_class . $class_split[$key];
        if ($key != $last_key) {
          $cur_class = $cur_class . "\\";
        }
      }
      $class_path = str_replace("\\", "/", $cur_class);
      $class_file = $test_path . $class_path . ".php";
      $dir_test = "../tests/". str_replace("\\", "/", $model->data["class"]);

      chdir($dir);
      file_put_contents($class_file, $res);
      $class_file_json = $dir_test . "/class-original.json";
      if (file_exists($class_file_json)) {
        $original = json_decode(file_get_contents($class_file_json), true);
        $original["modified"] = true;
        if ($original['methods'][$method] && !empty($original['methods'][$method])) {
          $original['methods'][$method] = $modified_data;
          $original['methods'][$method]["modified"] = true;
        }
        $resp["original"] = $original;
        file_put_contents($class_file_json, json_encode($original, JSON_PRETTY_PRINT));
      }
      $resp['success'] = true;
      $resp['data'] = $res;
    }
  }
  catch (Exception $e) {
    $resp["error"] = $e->getMessage();
  }
}

return $resp;