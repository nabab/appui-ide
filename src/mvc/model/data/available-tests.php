<?php

use bbn\X;
use bbn\Str;
/** @var $model \bbn\Mvc\Model*/

use bbn\Parsers\Php;


$res = [
  "success" => false,
];

$libclass = [];
$fs = new bbn\File\System();
$parser = new Php();
$xml = new DOMDocument();

$output=null;
$retval=null;

if ($model->hasData("lib") && $model->hasData("class")) {
  $lib = $model->data["lib"];
  $cur_class = $model->data["class"];

  try {
    $dir = $model->dataPath("appui-ide") . "class_editor/" . $lib . "/lib/";
    $composer = $dir . "composer.json";
    if (file_exists($composer)) {
      $content = $fs->decodeContents($composer, null, true);
      $libpath = "";
      $test_path = "";
      if (isset($content['autoload'])) {
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
          $libpath = $psr_value[$libnamespace];
        }
      }
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
      $libphpfiles = $fs->scan($dir . $libpath, function($a) {
        return strpos($a, ".php") !== false;
      });
      foreach($libphpfiles as $libfile) {
        $needle = str_replace(".php", "", str_replace($dir . $libpath, "", $libfile));
        $class = str_replace("/", "\\", $needle);
        if (class_exists($libnamespace . $class)) {
          $libclass[] = $class;
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
      $currentDir = getcwd();
      $found = false;
      foreach($libclass as $cls) {
        if ($cls == $cur_class) {
          $found = true;
          break;
        }
      }
      if ($found) {
        $test_autoload = $dir . $test_path . "autoload.php";
        if (file_exists($test_autoload)) {
          chdir($dir . $test_path);
          include_once("autoload.php");
          $test_class = $libtestnamespace . $cur_class . "Test";
          if (class_exists($test_class)) {
            chdir("../");
            $test_class_path = str_replace("\\", "/", $cur_class);
            $test_file = $test_path . $test_class_path . "Test.php";
            $output_xml = "../tests/report_" . md5($test_file) . ".xml";
            $exec = "vendor/bin/phpunit $test_file --log-junit $output_xml --no-output";
            exec($exec, $output, $retval);
            $xml->load($output_xml);
            $test_results = [];
            $testcases = $xml->getElementsByTagName('testcase');
            $k = 0;
            foreach ($testcases as $test) {
              $method = $testcases->item($k)->getAttribute('name');
              $error = $testcases->item($k)->getElementsByTagName('error');
              $failure = $testcases->item($k)->getElementsByTagName('failure');
              $skipped = $testcases->item($k)->getElementsByTagName('skipped');
              if ($error->length) {
                $test_results[$method]["status"] = "error";
                $test_results[$method]["error"] = $error->item(0)->nodeValue;
              }
              else if ($failure->length) {
                $test_results[$method]["status"] = "failure";
                $test_results[$method]["failure"] = $failure->item(0)->nodeValue;
              }
              else if ($skipped->length) {
                $test_results[$method]["status"] = "skipped";
                $test_results[$method]["skipped"] = $skipped->item(0)->nodeValue;
              }
              else {
                $test_results[$method]["status"] = "success";
              }
              $k++;
            }
            $parse_test = $parser->analyzeClass($test_class);
            $parse_cls = $parser->analyzeClass($libnamespace . $cur_class);
            if (!empty($parse_test["methods"]) && !empty($parse_cls["methods"])) {
              $tmp = [];
              foreach($parse_cls["methods"] as $m) {
                if (!empty($m["parent"])) {
                  continue;
                }
                $tmp[$m["name"]] = [
                  "method" => $m["name"],
                  "last_results" => [],
                  "test_methods" => [],
                  "available_tests" => 0,
                ];
              }
              $methods = array_keys($tmp);
              foreach($parse_test["methods"] as $m) {
                if (!empty($m["parent"])) {
                  continue;
                }
                $testedMethod = X::split($m["name"], "_method_")[0];
                if (in_array($testedMethod, $methods)) {
                  $tmp[$testedMethod]["test_methods"][] = $m["name"];
                  $tmp[$testedMethod]["last_results"][$m["name"]] = $test_results[$m["name"]];
                  $tmp[$testedMethod]["available_tests"] = sizeof($tmp[$testedMethod]["test_methods"]);
                }
              }
            }
            $res["data"] = array_values($tmp);
            //X::ddump($res["data"]);
            $res["success"] = true;
          }
          else {
            $res["data"] = array_values($parser->analyzeClass($libnamespace . $cur_class)["methods"]);
          }
        }
        else {
          $res["data"] = array_values($parser->analyzeClass($libnamespace . $cur_class)["methods"]);
        }
      }
    }
  }
  catch (Exception $e) {
    $res["error"] = $e->getMessage();
  }
}

return $res;