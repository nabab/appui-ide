<?php

use bbn\X;
use bbn\Str;
/** @var $model \bbn\Mvc\Model*/

$test_files = [];
$found = false;
$test_file = "";
$fs = new bbn\File\System();

$res = [
  'success' => false
];

if ($model->hasData('lib') && $model->hasData('class')) {
  try {
    $fullpath = $model->libPath() . $model->data['lib'];
    $composer = $fs->scan($fullpath, function($a) {
      return strpos($a, "composer.json") !== false;
    });
    if ($composer) {
      class HtmlOutput extends \Symfony\Component\Console\Output\Output
      {
        public function __construct()
        {
          parent::__construct(self::VERBOSITY_NORMAL, false, null);
        }

        public function writeln($messages, $options = 0)
        {
          $this->write($messages, true, $options);
        }

        public function write($messages, $newline = false, $options = self::OUTPUT_NORMAL)
        {
          $this->doWrite($messages, $newline);
        }

        protected function doWrite($message, $newline)
        {
          /*\Installer::report($message);
          if ($newline) {
            \Installer::report("\n");
          }*/
        }
      }

      $content = $fs->decodeContents($composer[0], null, true);
      if (isset($content['autoload-dev'])) {
        $autoload_dev = $content['autoload-dev'];
        if ($autoload_dev['psr-4']) {
          $psr_value = $autoload_dev['psr-4'];
        }
        else if ($autoload_dev['psr-0']) {
          $psr_value = $autoload_dev['psr-0'];
        }
        $psr_keys = array_keys($psr_value);
        foreach($psr_keys as $test_folder) {
          $tests = $fullpath . "/" . $psr_value[$test_folder];
          $class_file = end(X::split($model->data['class'], "\\")) . "Test.php";
          $test_files = $fs->scan($tests, function($a) {
            return strpos($a, $class_file) !== false;
          });
          if ($test_files) {
            foreach($test_files as $file) {
              if ($class_file === end(X::split($file, "/"))) {
                $found = true;
                $test_file = $file;
                break;
              }
            }
          }
          if ($found) {
            break;
          }
        }
      }
    }
    $dir = $model->dataPath("appui-ide") . "class_editor/" . $model->data['lib'] . "/";
    if (file_exists($dir)) {
      $fs->delete($dir, true);
    }
    else {
    	$fs->createPath($dir);
    }
    if (!$fs->isFile($dir . ".bbn")) {
      $fs->putContents($dir . ".bbn", json_encode([
        "time" => time(),
        "lib" => $model->data['lib']
      ]));
      $fs->copy($fullpath, $dir . "lib", true);
      chdir($dir . "lib");

      $json = $content;
      $json['config'] = [
        'process-timeout' => 600,
        'github-protocols' => ['https']
      ];
      if (file_put_contents("./composer.json", json_encode($json, JSON_PRETTY_PRINT))) {
        if (false && $fs->exists($model->libPath() . "bin/composer")) {
          $fs->copy($model->libPath() . "bin/composer", "./composer.phar");
        }
        else {
          file_put_contents("./composer.phar", file_get_contents('https://getcomposer.org/composer.phar'));
        }
        $comp_path = $dir."lib";
        chmod("./composer.phar", 0740);
        putenv('COMPOSER_HOME=' . $comp_path);
        putenv('COMPOSER_DISABLE_XDEBUG_WARN=1');
        $ph = new Phar($model->appPath(true) . 'composer.phar');
        $ph->extractTo($comp_path, null, true);
        $input = new Symfony\Component\Console\Input\ArrayInput(
          [
            'command' => 'install',
            //'--no-dev' => true,
            '--no-interaction' => true,
            '--no-progress' => true,
            '--working-dir' => $comp_path . '',
            //'--verbose' => true
          ]
        );
        //$input = new Symfony\Component\Console\Input\StringInput('install -n -d '.$this->root_path.'');
        $output = new HtmlOutput();
        $application = new Composer\Console\Application();
        $application->setAutoExit(false);
        $application->run($input, $output);
        include_once $comp_path . 'vendor/autoload.php';
        $res["message"] = class_exists("\\bbn\\tests\\Files");
      }
      $res["success"] = true;
    }
  }
  catch (Exception $e) {
    $res["error"] = $e->getMessage();
  }
}
return $res;