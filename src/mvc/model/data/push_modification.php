<?php

use bbn\X;
use bbn\Str;
/** @var $model \bbn\Mvc\Model*/

use bbn\Parsers\Php;
use bbn\Parsers\Generator;

$res = [
  "success" => false,
];

$fs = new bbn\File\System();
$parser = new Php();

if ($model->hasData("lib") && $model->hasData("class")
    && $model->hasData("function") && $model->hasData("code")
    && $model->hasData("libfunction")) {
  $lib = $model->data["lib"];
  $cur_class = $model->data["class"];
  $modifying_function = $model->data["function"];
  $modifying_code = $model->data["code"];
  $libfunction = $model->data["libfunction"];

  try {
    $dir = $model->dataPath("appui-newide") . "class_editor/" . $lib . "/lib/";
    $composer = $dir . "composer.json";
    if (file_exists($composer)) {
      $content = $fs->decodeContents($composer, null, true);
      $test_path = "";
      if (isset($content['autoload-dev'])) {
        $autoload_dev = $content['autoload-dev'];
        if ($autoload_dev['psr-4']) {
          $psr_value = $autoload_dev['psr-4'];
        }
        else if ($autoload_dev['psr-0']) {
          $psr_value = $autoload_dev['psr-0'];
        }
        $psr_keys = array_keys($psr_value);
        if (sizeof($psr_keys) == 1) {
          $libtestnamespace = $psr_keys[0];
          $test_path = $psr_value[$libtestnamespace];
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
    $test_autoload = $dir . $test_path . "autoload.php";
    if (file_exists($test_autoload)) {
      chdir($dir . $test_path);
      include_once("autoload.php");
      $test_class = $libtestnamespace . $cur_class . "Test";
      if (class_exists($test_class)) {
        chdir("../");
        $test_class_path = str_replace("\\", "/", $cur_class);
        $test_file = $test_path . $test_class_path . "Test.php";
        $dir_test = "../tests/". str_replace("\\", "/", $model->data["class"]);
        $parse_test = $parser->analyzeClass($test_class);
        if (!empty($parse_test["methods"])) {
          if ($parse_test["methods"][$modifying_function] && !empty($parse_test["methods"][$modifying_function])) {
            if ($parse_test["methods"][$modifying_function]["code"] !== $modifying_code) {
              $parse_test["methods"][$modifying_function]["code"] = $modifying_code;
            }
          }
          $gen = new Generator($parse_test);
          $res["data"] = $gen->generateClass();
          //X::ddump($res["data"]);
          file_put_contents($test_file, $res["data"]);
          $test_file_json = $dir_test . "/original.json";
          if (file_exists($test_file_json)) {
            $original = json_decode(file_get_contents($test_file_json), true);
            $original["modified"] = true;
            if ($original[$libfunction]["details"] && !empty($original[$libfunction]["details"][$modifying_function])) {
              $original[$libfunction]["details"][$modifying_function]["modified"] = true;
              $original[$libfunction]["details"][$modifying_function]["code"] = $modifying_code;
            }
            //X::ddump($original);
            $res["original"] = $original;
            file_put_contents($test_file_json, json_encode($original, JSON_PRETTY_PRINT));
          }
          $res["success"] = true;
        }
      }
    }
  }
  catch (Exception $e) {
    $res["error"] = $e->getMessage();
  }
}

return $res;