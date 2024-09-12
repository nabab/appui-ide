<?php

namespace appui\ide;

use bbn\X;
use bbn\Str;
use bbn\Mvc;
use bbn\File\System;
use bbn\Parsers\Php;
use bbn\Parsers\Generator;
use bbn\Appui\Ai;
use Symfony\Component\Console\Input\ArrayInput;
use Composer\Console\Application;
use appui\ide\Output;
use Exception;
use Phar;
use DOMDocument;


class Environment
{
  private string $router;  // The path to the router file.
  private string $dir;     // The directory path where the class_editor will be created.
  private System $fs;      // An instance of the bbn\File\System class.
  private Php $parser;     // An instance of the bbn\Parsers\Php class.
  private DOMDocument $xml; // An instance of DOMDocument class.
  private string $defaultDir;
  private string $defaultAppLibDir;
  private string $envDataDir;



  /**
   * This function extracts information, and constructs an array of available libraries along with their metadata.
   * @return array
   */
  public static function getAvailableLibraries(): array
  {
    $fs = new System(); // Create an instance of the bbn\File\System class.
    $path = Mvc::getLibPath(); // Get the library path using the Mvc::getLibPath() method.
    $fs->cd($path); // Change the current directory to the library path.
    
    // Scan the current directory for files and filter them based on the presence of "composer.json".
    $composers = $fs->scan(".", function($a) {
        return strpos($a, "composer.json") !== false;
    });
    
    // Initialize the result array with a default value.
    $res = [
        'success' => false,
    ];

    if ($composers) {
        $res['success'] = true; // Update the success status in the result array.
        $res['libraries'] = []; // Initialize an array to store library information.

        // Loop through each found "composer.json" file.
        foreach($composers as $c) {
          $content = $fs->decodeContents($c, null, true); // Decode the content of the composer.json file. 
          // Check if "autoload" key exists in the decoded content.
          if (isset($content['autoload'])) {
            $bits = X::split($c, "/"); // Split the file path using "/" separator.
            $lib = $bits[0] . "/" . $bits[1]; // Construct the library name.
            $libpath = $path . $lib; // Create the full library path.
            $libgit = $libpath . "/.git"; // Create the path to the .git folder.
            
            // Check if the .git folder exists within the library path.
            if (in_array($libgit, $fs->scand($libpath, true), true)) {
              // Add library information to the "libraries" array.
              $res['libraries'][] = [
                'text' => $lib,
                'root' => 'lib',
                'value' => $lib
              ];
            }
          }
        }
      // Add information about the "Main Library" to the "libraries" array.
      $res['libraries'][] = [
        'text' => X::_("Main Library"),
        'root' => 'app',
        'value' => 'main'
      ];
    }
    return $res; // Return the result array containing library information.
  }


  /**
   * Constructor.
   * @return void
   */
  public function __construct(
    protected string $root,
    protected string $lib
  )
  {
    $this->router = __DIR__ . '/router-alt.php';
    $this->dir = Mvc::getDataPath("appui-ide") . "class_editor/" . $this->root . ($this->root !== 'app' ? "/" . $this->lib : '');
    $this->fs = new System();
    $this->parser = new Php();
    $this->xml = new DOMDocument();
    $this->defaultDir = '/_env';
    $this->defaultAppLibDir = '/src/lib';
    $this->envDataDir = '/data';
  }

  /**
   * This function determines the path to the composer.json file for a specific library, considering the root property.
   * @return array
   */
  public function getComposerInfos(): array
  {
    $func_name = 'get' . ucfirst($this->root) . 'Path'; // Construct the function name based on the root property.
    $fullpath = Mvc::{$func_name}() . ($this->root === 'app' ? 'lib' : $this->lib); // Construct the full library path using the Mvc::get{Root}Path() method.

    $composer = ''; // Initialize the variable to store the composer.json file path.

    // Check the value of the root property to determine the source of the composer.json file.
    if ($this->root === 'app') {
        $composer = Mvc::{$func_name}(true) . 'composer.json'; // If root is 'app', use the composer.json file path within the app directory.
    } else {
        // Scan the full library path for files and filter them based on the presence of "composer.json".
        // Assign the first found composer.json file to the $composer variable.
        if ($tmp = $this->fs->scan($fullpath, function($a) {
            return strpos($a, "composer.json") !== false;
        })) {
            $composer = $tmp[0];
        }
    }

    // Return an array containing composer.json file path and fullpath.
    return [
        'composer' => $composer,
        'fullpath' => $fullpath
    ];
  }

  /**
   * This function decodes the content of the composer.json file, checks if the specified flag exists in the content, and extracts the PSR-4 or PSR-0 autoload definitions if available.
   * @param string $comoposer (composer filepath)
   * @param string $flag
   * @return array
   */
  public function getPsrInfos(string $composer, string $flag): ?array
  {
    if ($composer) { // Check if the composer information is provided.
        $content = $this->fs->decodeContents($composer, null, true); // Decode the content of the provided composer.json file.

        if (isset($content[$flag])) { // Check if the specified flag (autoload or autoload-dev) exists in the content.
            $autoload = $content[$flag]; // Retrieve the autoload or autoload-dev section from the content.

            // Check if the autoload section contains 'psr-4' or 'psr-0' autoload definitions.
            if (isset($autoload['psr-4'])) {
                $psr_value = $autoload['psr-4'];
            } elseif (isset($autoload['psr-0'])) {
                $psr_value = $autoload['psr-0'];
            }

            $psr_keys = array_keys($psr_value); // Get the keys (namespaces) defined within the PSR autoload section.

            // Return an array containing the keys (namespaces) and the PSR autoload values.
            return [
                'psr_keys' => $psr_keys,
                'psr_value' => $psr_value
            ];
        }
        return null; // Return null if the specified flag is not found in the composer content.
    }

    return null; // Return null if no composer information is provided.
  }


  /**
   * This function retrieves the available classes within the specified library using the composer information and the PSR autoload definitions.
   * @return array
   */
  public function getLibraryClasses(): array
  {
    $res = [
        'success' => false,
    ];
    $library = []; // An array to hold the library classes.
    $exists = $this->check();

    if (!$exists['found']) {
      // Retrieve composer information using the getComposerInfos() method.
      $composer_infos = $this->getComposerInfos();
      $composer = $composer_infos['composer']; // The path to the composer.json file.
      $fullpath = $composer_infos['fullpath']; // The full path to the library.
    }
    else {
      $composer = $this->dir . $this->defaultDir . '/composer.json';
      $fullpath = $this->dir . $this->defaultDir;
    }

    if ($this->root !== 'app') { // Check if the root is not 'app'.
      $psr_infos = $this->getPsrInfos($composer, 'autoload'); // Get PSR autoload information.
      if (!$exists['found']) {
        if (!is_null($psr_infos)) { // Check if PSR autoload information is available.
          $psr_keys = $psr_infos['psr_keys']; // Retrieve the namespaces defined in PSR autoload.
          $psr_value = $psr_infos['psr_value']; // Retrieve the PSR autoload values.

          foreach ($psr_keys as $namespace) {
              // Get the library classes using the parser's getLibraryClasses() method.
              $libs = $this->parser->getLibraryClasses($fullpath . "/" . $psr_value[$namespace], $namespace);

              if ($libs) {
                  $library = array_merge($library, $libs); // Merge the retrieved classes into the library array.
              }
          }
          $res['success'] = true; // Indicate that the operation was successful.
        }
      }
      else {
        // Check classes in the Test environment if it exists.
        $cfg = [
          'operation' => 'getLibraryClasses',
          'dir' => $this->dir . $this->defaultDir,
          'fullpath' => $fullpath,
          'lib' => $this->lib,
          'psr_infos' => $psr_infos
        ];
        $library = $this->execute($cfg);
        X::ddump($exists, $cfg, $library);
        $res['success'] = true;
      }
    }
    elseif ($composer && $this->root === 'app') { // If the root is 'app' and composer information is available.
      X::ddump($exists);
      if (!$exists['found']) {
        // Get the library classes directly using the parser's getLibraryClasses() method.
        $libs = $this->parser->getLibraryClasses($fullpath);
        $library = array_merge($library, $libs); // Merge the retrieved classes into the library array.
        $res['success'] = true; // Indicate that the operation was successful.
      }
      else {
        $psr_infos = $this->getPsrInfos($composer, 'autoload'); // Get PSR autoload information.
        // Check classes in the Test environment if it exists.
        $cfg = [
          'operation' => 'getLibraryClasses',
          'dir' => $this->dir . $this->defaultDir,
          'fullpath' => $fullpath,
          'lib' => $this->lib,
          'psr_infos' => $psr_infos
        ];
        $library = $this->execute($cfg);
        $res['success'] = true;
      }
    }

    $res['data'] = $library; // Assign the library data to the 'data' key in the result array.

    return $res; // Return the result array containing the library classes.
  }


  /**
   * This function is responsible for executing a PHP script using the shell_exec() function.
   * @param string $file
   * @param array $params
   * @return array
   */
  public function execute(array $params): array
  {
    chdir(Mvc::getAppPath());
    // Construct a command to execute a PHP script using shell_exec().
    $output = shell_exec(
        sprintf(
            'php -f %s %s "%s"',
            $this->router, // The path to the router script.
            'test-process',
            Str::escapeDquotes(json_encode($params)) // The parameters, JSON-encoded and escaped.
        )
    );

    //X::ddump($output);
    // If output is received, decode it from JSON format to an array; otherwise, initialize as an empty array.
    $data = $output ? json_decode($output, true) : [];

    return $data; // Return the decoded data array.
  }

  
  /**
   * Create a `composer.json` file with specific autoload configurations in a directory.
   *
   * This function checks if a `composer.json` file exists in the specified directory.
   * If it does not exist, it creates one with predefined autoload settings.
   *
   * @param string $composer The path to an existing `composer.json` file to use as a template.
   * @param string $dir      The target directory where the `composer.json` file will be created.
   *
   * @return int|false Returns the number of bytes written to the `composer.json` file on success,
   *                  or `false` on failure.
   */
  public function createComposer($composer, $dir): int|false
  {
    // Check if a `composer.json` file already exists in the specified directory.
    if (!file_exists($dir . '/composer.json')) {
      // Load the existing `composer.json` template located at the path specified by $composer.
      $json = json_decode(file_get_contents($composer), true);

      // Remove the 'repositories' key from the JSON data (if it exists).
      unset($json['repositories']);

      // Define autoload configurations:
      // 1. 'psr-4' autoload mapping for the root namespace (empty string) to 'src/lib' directory.
      // 2. 'psr-4' autoload mapping for the 'tests\\' namespace to the 'tests/' directory.
      $json['autoload'] = [
        'psr-4' => [
          "" => "src/lib"
        ]
      ];
      $json['autoload-dev'] = [
        'psr-4' => [
          "tests\\" => "tests/"
        ]
      ];

      // Define the path for the new `composer.json` file.
      $file = $dir . '/composer.json';

      // Write the modified JSON data to the `composer.json` file.
      // The JSON data is formatted with JSON_PRETTY_PRINT for readability.
      return file_put_contents($file, json_encode($json, JSON_PRETTY_PRINT));
    }
  }


  /**
   * Create PHPUnit configuration files (phpunit.xml and phpunit.xml.dist) in a directory.
   *
   * This function checks if the PHPUnit configuration files (phpunit.xml and phpunit.xml.dist) already exist
   * in the specified directory. If they do not exist, it creates them with predefined content.
   *
   * @param string $dir The target directory where the PHPUnit configuration files will be created.
   *
   * @return int|false Returns the number of bytes written to the phpunit.xml file on success,
   *                  or `false` on failure or if the files already exist.
   */
  public function createTestDependencies($dir): int|false
  {
    // Check if phpunit.xml or phpunit.xml.dist already exist in the specified directory.
    if (!file_exists($dir . '/phpunit.xml') || !file_exists($dir . '/phpunit.xml.dist')) {
      // Define the content of the phpunit.xml file.
      $content =
  '<?xml version="1.0"?>
  <phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
            xsi:noNamespaceSchemaLocation="https://schema.phpunit.de/10.1/phpunit.xsd"
            backupGlobals="true"
            colors="true"
            processIsolation="false"
            stopOnError="false"
            stopOnFailure="false"
            stopOnIncomplete="false"
            stopOnSkipped="false"
            timeoutForSmallTests="1"
            timeoutForMediumTests="10"
            timeoutForLargeTests="60"
            stderr="true"
            cacheDirectory=".phpunit.cache"
            backupStaticProperties="false"
            requireCoverageMetadata="false"
  >
    <testsuites>
      <testsuite name="Classes">
        <directory>tests</directory>
      </testsuite>
    </testsuites>
  </phpunit>';

      // Define the path for the phpunit.xml file.
      $file = $dir . '/phpunit.xml';

      // Write the predefined content to the phpunit.xml file.
      return file_put_contents($file, $content);
    }
    // Return false if the files already exist in the specified directory.
    return false;
  }


  /**
   * Get the path to the environment directory.
   *
   * This function calculates and returns the path to the environment directory based on the
   * value of the $root property and some predefined directory components.
   *
   * @return string The path to the environment directory.
   */
  public function getEnvPath(): string
  {
    $res = ""; // Initialize the result variable as an empty string.

    // Check if the $root property is set to 'app'.
    if ($this->root === 'app') {
      // If the $root is 'app', concatenate the directory components to form the path.
      $res = $this->dir . $this->defaultDir . $this->defaultAppLibDir;
    } else {
      // If the $root is not 'app', concatenate the directory components to form the path.
      $res = $this->dir . $this->defaultDir;
    }

    // Return the calculated path to the environment directory.
    return $res;
  }



  /**
   * Execute a Composer action.
   *
   * This private method is used to perform various Composer-related actions such as installation or update.
   *
   * @param string $action The Composer action to be executed (e.g., 'install' or 'update').
   */
  private function composerAction(string $action): void
  {
    // Define the path to the Composer directory.
    $comp_path = $this->dir . $this->defaultDir;

    // Change the current working directory to the Composer directory.
    ini_set('phar.readonly', 0);
    chdir($comp_path);

    // Change the permissions of the 'composer.phar' file.
    if (!file_exists(Mvc::getAppPath(true) . "composer.phar")) {
      copy(Mvc::getLibPath() . 'bin/composer', Mvc::getAppPath(true) . "composer.phar");
      chmod(Mvc::getAppPath(true) . "composer.phar", 0740);
    }


    // Set environment variables for Composer.
    putenv('COMPOSER_HOME=' . $comp_path);
    putenv('COMPOSER_DISABLE_XDEBUG_WARN=1');

    // Create a new Phar object from the Composer Phar archive.
    $ph = new Phar(Mvc::getAppPath(true) . 'composer.phar');

    // Extract the Phar archive to the installation directory.
    $ph->extractTo($this->dir . $this->envDataDir . "/install", null, true);

    // Define the input parameters for the Composer command.
    $input = new ArrayInput([
      'command' => $action,
      '--no-interaction' => true,
      '--no-progress' => true,
      '--working-dir' => $comp_path . '',
    ]);

    // Create a new output object.
    $output = new Output();

    // Create a new Composer application.
    $application = new Application();

    // Disable auto-exit for the Composer application.
    $application->setAutoExit(false);

    // Run the Composer command with the specified input and output.
    $application->run($input, $output);

    // Include the Composer-generated autoload file.
    include_once $comp_path . '/vendor/autoload.php';
  }


  /**
   * This function prepare the necessary testing environment for a specific class by copying the library source code and setting up Composer dependencies.
   * @param string $class
   * @return array
   */
  public function install(): array
  {
    
    $res = [
        'success' => false
    ];

    try {
        // Get composer and PSR info
        $composer_infos = $this->getComposerInfos();
        $composer = $composer_infos['composer'];
        $fullpath = $composer_infos['fullpath'];
        
        if ($composer) {
          // Delete existing directory or create it
          if (file_exists($this->dir)) {
            $this->fs->delete($this->dir, true);
          }
          $path = $this->getEnvPath();
          $this->fs->createPath($path);

          // Create and configure Composer environment
          if (!$this->fs->isFile($this->dir . "/.bbn")) {
            $t = time();
            $res['libtime'] = $t;
            $this->fs->putContents($this->dir . "/.bbn", json_encode([
              "time" => $t,
              "lib" => $this->lib
            ]));
            $this->fs->copy($fullpath, $path, true);
            if ($this->root === 'app') {
              $this->createComposer($composer, ($this->dir . $this->defaultDir));
              $this->createTestDependencies($this->dir . $this->defaultDir);
            }

            // Modify composer.json and install dependencies
            $this->composerAction('install');
            $res["success"] = true;
          }
        }
    } catch (Exception $e) {
        $res["error"] = $e->getMessage();
    }
    return $res;
  }



  /**
   * This function is responsible for deleting a directory specified by the $this->dir property.
   * @return array
   */
  public function delete(): array
  {
    $res = [
        'success' => false
    ];

    try {
        // Check if the directory exists.
        if (file_exists($this->dir)) {
            // Delete the directory recursively using the FileSystem (fs) object.
            $this->fs->delete($this->dir, true);
            $res["success"] = true; // Set success to true if the deletion was successful.
        }
    } catch (Exception $e) {
        // If an exception occurs during the deletion process, capture the error message.
        $res["error"] = $e->getMessage();
    }

    return $res; // Return the result array indicating success or an error message.
  }



  /**
   * This function is responsible for checking the existence of a directory specified by the $this->dir property.
   * @return array
   */
  public function check()
  {
    $res = [
        'success' => false,
        'found' => false
    ];
    
    try {
        // Check if the directory exists.
        if (file_exists($this->dir)) {
          $data = (array)(json_decode(file_get_contents($this->dir . '/.bbn')));
          $res['libtime'] = $data['time'];
          $res["success"] = true; // Directory exists, set success to true.
          $res["found"] = true;   // Also set 'found' to true.
        } else {
          $res["success"] = true; // Directory doesn't exist, set success to true.
          $res["found"] = false;  // Set 'found' to false.
        }
    } catch (Exception $e) {
        // If an exception occurs, capture the error message.
        $res["error"] = $e->getMessage();
    }
    
    return $res; // Return the result array indicating whether the directory was found or if an error occurred.
  }



  /**
   * Parse the XML output of PHPUnit test results.
   *
   * @param string $output_xml The path to the XML file containing PHPUnit test results.
   *
   * @return array An array of parsed test results, organized by test method.
   */
  public function parseTestsOutput(string $output_xml): array
  {
    // Load the XML file using the DOMDocument.
    $this->xml->load($output_xml);
    
    // Initialize an array to store the parsed test results.
    $test_results = [];
    
    // Get all <testcase> elements from the XML.
    $testcases = $this->xml->getElementsByTagName('testcase');
    
    // Iterate through each <testcase> element in the XML.
    foreach ($testcases as $k => $test) {
      // Get the name attribute of the <testcase> element, which corresponds to the test method name.
      $method = $testcases->item($k)->getAttribute('name');
      // Check if there are <error> elements within the <testcase> element.
      $error = $testcases->item($k)->getElementsByTagName('error');
      // Check if there are <failure> elements within the <testcase> element.
      $failure = $testcases->item($k)->getElementsByTagName('failure');
      // Check if there are <skipped> elements within the <testcase> element.
      $skipped = $testcases->item($k)->getElementsByTagName('skipped');
      
      // Determine the status of the test based on the presence of <error>, <failure>, or <skipped> elements.
      if ($error->length) {
        $test_results[$method]["status"] = "error";
        $test_results[$method]["error"] = $error->item(0)->nodeValue;
      } elseif ($failure->length) {
        $test_results[$method]["status"] = "failure";
        $test_results[$method]["failure"] = $failure->item(0)->nodeValue;
      } elseif ($skipped->length) {
        $test_results[$method]["status"] = "skipped";
        $test_results[$method]["skipped"] = $skipped->item(0)->nodeValue;
      } else {
        // If none of the above elements are present, consider the test successful.
        $test_results[$method]["status"] = "success";
      }
    }
    
    // Return the parsed test results as an array.
    return $test_results;
  }



  /**
   * Prepare the environment for executing tests for a given class.
   *
   * @param string $class The name of the class for which to prepare the test execution environment.
   *
   * @return array An array containing test execution environment information.
   */
  public function prepareTestExecution(string $class): array
  {
    // Get the directory path where the composer.json file is located.
    $dir = $this->dir . $this->defaultDir;
    $composer = $dir . "/composer.json";

    // Check if the composer.json file exists.
    if (file_exists($composer)) {
      // Initialize variables to store test-related information.
      $test_path = "";
      $libtestnamespace = "";
      $namespace = "";

      // Get information related to autoload-dev from composer.json.
      $psr_infos = $this->getPsrInfos($composer, 'autoload-dev');
      if (!is_null($psr_infos)) {
        $psr_keys = $psr_infos['psr_keys'];
        $psr_value = $psr_infos['psr_value'];

        // Check if there is only one PSR-4 namespace specified.
        if (count($psr_keys) == 1) {
          $libtestnamespace = $psr_keys[0];
          $test_path = $psr_value[$libtestnamespace];
        }
      }

      // Get information related to autoload from composer.json.
      $psr_infos = $this->getPsrInfos($composer, 'autoload');
      if (!is_null($psr_infos)) {
        $psr_keys = $psr_infos['psr_keys'];
        $psr_value = $psr_infos['psr_value'];

        // Check if there is only one PSR-4 namespace specified.
        if (count($psr_keys) == 1) {
          $namespace = $psr_keys[0];
        }
      }

      // Adjust the class name to remove the base namespace, resulting in the class name within the test namespace.
      $cur_class = str_replace($namespace, '', $class);

      // Return an array containing test execution environment information.
      return [
        'test_path' => $test_path,
        'cur_class' => $cur_class,
        'libtestnamespace' => $libtestnamespace
      ];
    }

    // If the composer.json file does not exist, return default values.
    return [
      'test_path' => null,
      'cur_class' => null
    ];
  }



  /**
   * Get the test report for a specific class.
   *
   * @param string $class The name of the class for which to retrieve the test report.
   *
   * @return array|null An array containing the parsed test report, or null if the report does not exist.
   */
  public function getTestReport(string $class)
  {
    // Construct the directory path for the test report based on the class name.
    $dir_test = $this->dir . $this->envDataDir . '/' . str_replace("\\", "/", $class);
    
    // Construct the path to the test report XML file.
    $output_xml = $dir_test . "/report.xml";
    
    // Check if the test report XML file exists.
    if (file_exists($output_xml)) {
      // If the file exists, parse its contents using the parseTestsOutput method.
      return $this->parseTestsOutput($output_xml);
    }
    
    // If the file does not exist, return null to indicate that the test report is not available.
    return null;
  }



  /**
   * Get information related to the test namespace, test class, and test directory for a given class.
   *
   * @param string $class The name of the class for which to obtain test-related information.
   *
   * @return array|null An array containing test-related information or null if the information is not available.
   */
  private function getTestNamespace($class): ?array
  {
    // Prepare the test execution environment and retrieve relevant information.
    $infos = $this->prepareTestExecution($class);
    $test_path = $infos['test_path'];

    // Check if the test path is not null (indicating the presence of test-related configuration).
    if (!is_null($test_path)) {
      // Construct the full path to the test directory.
      $testdir = $this->dir . $this->defaultDir . '/' . $test_path;

      // Build the full name of the test class within the test namespace.
      $testclass = $infos['libtestnamespace'] . $infos['cur_class'] . "Test";

      // Return an array containing test-related information, including test directory, test class, and test namespace.
      return [
        'testdir' => $testdir,
        'testclass' => $testclass,
        'testnamespace' => $infos['libtestnamespace']
      ];
    }

    // If the test path is null, return null to indicate that test-related information is not available.
    return null;
  }
  

  /**
   * This function analyzes a test class and returns its analysis if available.
   *
   * @param string $class The name of the test class to analyze.
   *
   * @return array|null An array containing analysis information if available, or null if not found.
   */
  private function getTestClassAnalysis(string $class): ?array
  {
    // Get information about the test class, including its namespace and directory.
    $infos = $this->getTestNamespace($class);

    // Check if test class information is available.
    if (!is_null($infos)) {
      // Check if the autoload.php file exists in the test class directory.
      if (file_exists($infos['testdir'] . '/autoload.php')) {
        // Prepare a configuration array for the 'execute' method.
        $cfg = [
          'operation' => 'analyzeTestClass',
          'dir' => $this->dir . $this->defaultDir,
          'testdir' => $infos['testdir'],
          'testclass' => $infos['testclass']
        ];

        // Execute the analysis operation and return the result.
        return $this->execute($cfg);
      }

      // Return null if the autoload.php file does not exist.
      return null;
    }

    // Return null if test class information is not available.
    return null;
  }



  /**
   * Execute tests for a given test class and return the results.
   *
   * @param string $class The name of the test class to execute tests for.
   *
   * @return array|null An array containing test results if available, or null if the class is not found or tests couldn't be executed.
   */
  public function execTestsForClass(string $class): ?array
  {
    $output = null; // Variable to store the output of the executed command.
    $retval = null; // Variable to store the return value of the executed command.

    // Get analysis information for the specified test class.
    $test_class_analysis = $this->getTestClassAnalysis($class);

    // Check if analysis information is available.
    if (!is_null($test_class_analysis) && !empty($test_class_analysis)) {
      // Set the environment directory for the tests.
      $env_dir = $this->dir . $this->defaultDir . '/';
      // Change the current working directory to the environment directory.
      chdir($env_dir);
      
      // Get the file path of the test class.
      $test_filepath = $test_class_analysis['fileName'];
      // Calculate the relative path to the test file.
      $test_file = str_replace($env_dir, '', $test_filepath);
      
      // Prepare the directory path for test output.
      $dir_test = '..' . $this->envDataDir . '/' . str_replace("\\", "/", $class);

      // Create the directory if it does not exist.
      if (!file_exists($dir_test)) {
        $this->fs->createPath($dir_test);
      }
      
      // Define the path for the XML output file.
      $output_xml = $dir_test . "/report.xml";
      
      // Construct the command to execute PHPUnit tests and capture the XML output.
      $exec = "vendor/bin/phpunit $test_file --log-junit $output_xml";
      exec($exec, $output, $retval);
      //X::ddump(getcwd(), $exec, $output, $retval);
      
      // Parse the XML output and return the test results.
      return $this->parseTestsOutput($output_xml);
    }
    
    // Return null if test class analysis information is not available.
    return null;
  }



  /**
   * Check if a given test method name contains the provided method name.
   *
   * @param string $test_method The name of the test method to check.
   * @param string $method_name The method name to search for within the test method name.
   *
   * @return bool Returns true if the method name is found within the test method name, otherwise false.
   */
  private function posNeedle(string $test_method, string $method_name): bool
  {
    $res = false; // Initialize a boolean result variable as false.
    
    // Define an array of keywords to search for in the test method name.
    $keywords = [
      'Test',
      'Method',
      'test',
      'method'
    ];

    // Iterate through each keyword in the keywords array.
    foreach ($keywords as $word) {
      // Check if the test method name starts with the keyword followed by the method name,
      // or if it starts with the method name followed by the keyword,
      // or if it starts with the keyword, an underscore, and then the method name,
      // or if it starts with the method name, an underscore, and then the keyword.
      $tmp = (
        str_starts_with($test_method, $word . $method_name) ||
        str_starts_with($test_method, $method_name . $word) ||
        str_starts_with($test_method, $word . '_' . $method_name) ||
        str_starts_with($test_method, $method_name . '_' . $word)
      );
      
      // Update the result variable by performing a logical OR with the temporary result.
      $res = $res || $tmp;
    }

    // Return the final result, which indicates whether the method name was found in the test method name.
    return $res;
  }



  /**
   * Interpret test results for a given class based on parsed class and test data.
   *
   * @param string $class The name of the class being interpreted.
   * @param array $parse_cls Parsed class data, including methods and details.
   * @param array $test_results Test results data for the class.
   *
   * @return array An array containing interpreted test data, including available tests and untested methods.
   */
  private function interpretTests(string $class, array $parse_cls, array $test_results): array
  {
    // Get the test class analysis for the specified class.
    $parse_test = $this->getTestClassAnalysis($class);
    
    // Check if both the parsed class and test data contain non-empty "methods" arrays.
    if (!empty($parse_test["methods"]) && !empty($parse_cls["methods"])) {
        $tmp = []; // Temporary array to store interpreted test data.
        $found = []; // Array to keep track of found methods in tests.
        $meth = []; // Array to store untested methods.

        // Iterate through each method in the parsed class data.
        foreach ($parse_cls["methods"] as $me) {
          // Skip methods with a parent (e.g., inherited methods).
          if (!empty($me["parent"])) {
            continue;
          }

          // Initialize an entry for the method in the temporary array.
          $tmp[$me["name"]] = [
            "available_tests" => 0,
            "method" => $me["name"],
            "details" => [],
          ];

          $testedMethod = $me["name"];

          // Skip methods with the name '_'.
          if ($testedMethod === '_') {
            continue;
          }

          // Iterate through each method in the parsed test data.
          foreach ($parse_test["methods"] as $m) {
            // Check if the method belongs to the same class.
            if ($m["class"] !== $parse_test['name']) {
              continue;
            }

            // Check if the method name contains the testedMethod as a substring.
            if ($this->posNeedle($m["name"], $testedMethod) !== false) {
              // Add the test result and code details to the method entry.
              $tmp[$testedMethod]["details"][$m["name"]] = $test_results[$m["name"]];
              $tmp[$testedMethod]["details"][$m["name"]]["code"] = $parse_test["methods"][$m["name"]]["code"];
              
              // Update the count of available tests for the method.
              $tmp[$testedMethod]["available_tests"] = sizeof(array_keys($tmp[$testedMethod]["details"]));
              
              // Track the found method.
              $found[] = $m["name"];
            }
          }
        }

        // Find untested methods and add them to the "meth" array.
        foreach ($parse_test["methods"] as $m) {
          if ($m["class"] === $parse_test['name'] && !in_array($m["name"], $found)) {
            $meth[$m['name']] = $m;
          }
        }

        // Return an array containing interpreted test data and untested methods.
        return [
          'tests' => $tmp,
          'methods' => $meth
        ];
    }
    
    // Return an empty array if either the parsed class or test data is empty.
    return [];
  }



  /**
   * Retrieve and report changes in test results and class data.
   *
   * @param array $parse_cls Parsed class data, including methods and details.
   * @param array $test_results Test results data for the class.
   * @param string $class The name of the class being analyzed.
   *
   * @return array An array containing information about modified test results and modified class data.
   */
  public function retrieveChanges(array $parse_cls, array $test_results, string $class)
  {
    $modified = []; // Array to store information about modified test results.
    $classmodified = []; // Array to store information about modified class data.

    // Define the directory path for test data and original JSON files.
    $dir_test = $this->dir . $this->envDataDir . '/' . str_replace("\\", "/", $class);
    $test_file = $dir_test . "/original.json";
    $class_original = $dir_test . "/class-original.json";

    // Check if both the test data and class data original JSON files exist.
    if (file_exists($test_file) && file_exists($class_original)) {
      // Read and decode the original JSON file for test data.
      $original = json_decode(file_get_contents($test_file), true);

      // Check if the "modified" flag is set to true in the original test data.
      if ($original["modified"]) {
        $modified["status"] = $original["modified"];
        $modified["details"] = [];
        
        // Get the keys (test method names) from the original test data.
        $keys = array_keys($original);

        // Iterate through each test method in the original test data.
        foreach ($keys as $test_meth) {
          if ($test_meth !== "modified") {
            foreach ($original[$test_meth]["details"] as $m => $data) {
              // Check if the test result for this method has been modified.
              if ($data["modified"]) {
                // Add the modified method to the details array.
                $modified["details"][$test_meth][] = $m;
              }
            }
          }
        }
      }

      // Read and decode the original JSON file for class data.
      $orig = json_decode(file_get_contents($class_original), true);

      // Check if the "modified" flag is set to true in the original class data.
      if ($orig["modified"]) {
        $classmodified["status"] = $orig["modified"];
        $classmodified["details"] = [];

        // Iterate through each method in the original class data.
        foreach ($orig['methods'] as $method => $infos) {
          // Check if the method has been modified.
          if ($infos['modified']) {
            // Add the modified method to the details array.
            $classmodified["details"][] = $method;
          }
        }
      }
    } else {
      // If the original JSON files do not exist, create and save them.
      file_put_contents($test_file, json_encode($test_results, JSON_PRETTY_PRINT));
      file_put_contents($class_original, json_encode($parse_cls, JSON_PRETTY_PRINT));
    }

    // Return an array containing information about modified test results and modified class data.
    return [
      'modified' => $modified,
      'classmodified' => $classmodified
    ];
  }




  /**
   * Get available tests and related information for a given class.
   *
   * @param string $class The name of the class to get available tests for.
   * @param bool $launch A boolean flag indicating whether to launch the tests (default: true).
   *
   * @return array An array containing information about available tests, methods, and modifications.
   */
  public function getAvailableTests(string $class, bool $launch = true): array
  {
    $res = [
      "success" => false,
    ];

    try {
      // Execute tests for the specified class.
      $tests = $this->execTestsForClass($class);

      // Check if tests were executed successfully and results are available.
      if (!is_null($tests)) {
        // Prepare a configuration array for class analysis.
        $cfg = [
          'operation' => 'analyzeClass',
          'class' => $class,
          'lib' => $this->lib,
          'dir' => $this->dir . $this->defaultDir
        ];

        // Execute class analysis and obtain parsed class data.
        $parse_cls = $this->execute($cfg);

        // Interpret test results and get available tests and untested methods.
        $tmp = $this->interpretTests($class, $parse_cls, $tests);

        // Populate the result array with available tests and methods.
        $res['data'] = $tmp['tests'];
        $res['methods'] = $tmp['methods'];

        // Retrieve and report changes in test results and class data.
        $modifications = $this->retrieveChanges($parse_cls, $res['data'], $class);

        // Add information about modified test results and class data to the result array.
        $res['modified'] = $modifications['modified'];
        $res['classmodified'] = $modifications['classmodified'];

        // Set the success flag to true, indicating successful execution.
        $res['success'] = true;
      }
    } catch (Exception $e) {
      // If an exception is caught, set an error message in the result array.
      $res["error"] = $e->getMessage();
    }

    // Return the result array containing test information and execution status.
    return $res;
  }



  /**
   * Modify a test class by updating the code for a specific test method.
   *
   * @param string $class The name of the test class to modify.
   * @param string $function The name of the test method to modify.
   * @param string $code The new code to replace the existing code in the test method.
   * @param string $libfunction The name of the library function associated with the test method.
   *
   * @return array An array containing information about the modification status and original JSON data.
   */
  public function modifyTestClass(string $class, string $function, string $code, string $libfunction): array
  {
    $res = [
      'success' => false,
    ];

    try {
      // Get the test class analysis for the specified class.
      $parse_test = $this->getTestClassAnalysis($class);

      // Check if the test class analysis is not null.
      if (!is_null($parse_test) && !empty($parse_test)) {
        // Get the file path of the test class.
        $test_file = $parse_test['fileName'];

        // Construct the directory path for test data.
        $dir_test = $this->dir . $this->envDataDir . '/' . str_replace("\\", "/", $class);

        // Check if the test class has methods.
        if (!empty($parse_test["methods"])) {
          // Check if the specified test method exists.
          if (!empty($parse_test["methods"][$function])) {
            // Check if the code for the test method needs to be updated.
            if ($parse_test["methods"][$function]["code"] !== $code) {
              $parse_test["methods"][$function]["code"] = $code;
            }
          }

          // Create a Generator object and generate the modified test class code.
          $gen = new Generator($parse_test);
          $res["data"] = $gen->generateClass();

          // Write the modified test class code to the test file.
          file_put_contents($test_file, $res["data"]);

          // Update the original JSON file for tracking modifications.
          $test_file_json = $dir_test . "/original.json";

          if (file_exists($test_file_json)) {
            // Read and decode the original JSON data.
            $original = json_decode(file_get_contents($test_file_json), true);

            // Set the "modified" flag to true in the original data.
            $original["modified"] = true;

            if ($libfunction !== '') {
              // Check if the original data has details for the specified library function and test method.
              if ($original[$libfunction]["details"] && !empty($original[$libfunction]["details"][$function])) {
                // Set the "modified" flag and update the code for the test method in the original data.
                $original[$libfunction]["details"][$function]["modified"] = true;
                $original[$libfunction]["details"][$function]["code"] = $code;
              }
            }

            // Store the updated original data in the result array.
            $res["original"] = $original;

            // Write the updated original JSON data back to the file.
            file_put_contents($test_file_json, json_encode($original, JSON_PRETTY_PRINT));
          }

          // Set the "success" flag to true to indicate a successful modification.
          $res["success"] = true;
        }
      }
    } catch (Exception $e) {
        // If an exception is caught, set an error message in the result array.
        $res["error"] = $e->getMessage();
    }

    // Return the result array containing modification status and original JSON data.
    return $res;
  }


  
  /**
   * This function is responsible for modifying a method in a library class and updating the related metadata and files.
   * @param string $class
   * @param array $data
   * @param string $method
   * @return array
   */
  public function modifyLibraryClass(string $class, array $data, string $method): array
  {
    $resp = [
      'success' => false,
    ];
    
    try {
        // Configuration data for the class modification.
        $cfg = [
          'operation' => 'analyzeClass',
          'class' => $class,
          'lib' => $this->lib,
          'dir' => $this->dir . $this->defaultDir
        ];
        
        // Execute a command to get parsing information about the class.
        $parse_cls = $this->execute($cfg);
        
        if (!empty($parse_cls)) {
          // Modify the specified method's data in the parsed class information.
          $parse_cls['methods'][$method] = $data;
          
          // Generate the updated class content using a generator.
          $generator = new Generator($parse_cls);
          $res = $generator->generateClass();
          
          $class_file = $parse_cls['fileName'];
          
          if (file_exists($class_file)) {
            // Update the class file with the new content.
            file_put_contents($class_file, $res);
            
            // Update the class's original JSON file with modification information.
            $dir_test = $this->dir . $this->envDataDir . str_replace("\\", "/", $class);
            $class_file_json = $dir_test . "/class-original.json";
            
            if (file_exists($class_file_json)) {
              $original = json_decode(file_get_contents($class_file_json), true);
              $original["modified"] = true;
              
              if ($original['methods'][$method] && !empty($original['methods'][$method])) {
                  $original['methods'][$method] = $data;
                  $original['methods'][$method]["modified"] = true;
              }
              
              $resp["original"] = $original;
              file_put_contents($class_file_json, json_encode($original, JSON_PRETTY_PRINT));
            }
            // Set the response indicating success and provide the updated class content.
            $resp['success'] = true;
            $resp['data'] = $res;
          }
        }
    } catch (Exception $e) {
        // If an exception occurs, capture the error message.
        $resp["error"] = $e->getMessage();
    }
    return $resp; // Return the response array indicating whether the modification was successful or if an error occurred.
  }


  private function analyzeClass(string $class, string $type): array
  {
    if ($type === 'libclass') {
      $cfg = [
        'operation' => 'analyzeClass',
        'class' => $class,
        'lib' => $this->lib,
        'dir' => $this->dir . $this->defaultDir
      ];
      return $this->execute($cfg);
    }
    else {
      $analysis = $this->getTestClassAnalysis($class);
      return (is_null($analysis)) ? [] : $analysis;
    }
  }

  private function modify(string $class, array $data, array $parse_cls, string $type = 'libclass'): array
  {
    $res = [
      'success' => false,
    ];
  
    $file = $parse_cls['fileName'];
    $dir = $this->dir . $this->envDataDir . '/' . str_replace("\\", "/", $class);
    $json_file = $dir . (($type === 'libclass') ? '/class-original.json' : '/original.json');
    $function = $data['function'];
    if (!empty($parse_cls["methods"]) && !empty($parse_cls["methods"][$function])) {
      if ($type === 'libclass') {
        $parse_cls['methods'][$function] = $data['raw'];
        if (file_exists($json_file)) {
          $original = json_decode(file_get_contents($json_file), true);
          $original["modified"] = true;
          if ($original['methods'][$function] && !empty($original['methods'][$function])) {
              $original['methods'][$function] = $data['raw'];
              $original['methods'][$function]["modified"] = true;
          }
          $res['original'] = $original;
          file_put_contents($json_file, json_encode($original, JSON_PRETTY_PRINT));
        }
      }
      else {
        $libfunction = $data['libfunction'];
        $code = $data['code'];
        $parse_cls['methods'][$function]['code'] = $code;
        if (file_exists($json_file)) {
          $original = json_decode(file_get_contents($json_file), true);
          $original["modified"] = true;
          if ($libfunction !== '') {
            if (!empty($original[$libfunction]["details"]) && !empty($original[$libfunction]["details"][$function])) {
              $original[$libfunction]["details"][$function]["modified"] = true;
              $original[$libfunction]["details"][$function]["code"] = $code;
            }
          }
          $res['original'] = $original;
          file_put_contents($json_file, json_encode($original, JSON_PRETTY_PRINT));
        }
      }
      $generator = new Generator($parse_cls);
      $gen = $generator->generateClass();
      file_put_contents($file, $gen);
      $res['success'] = true;
      $res['data'] = $gen;
    }
    else {
      $res['error'] = 'Method to modify not exists.';
    }
    return $res;
  }

  public function modifyClassMethod(string $class, array $data, string $type = 'libclass')
  {
    $res = [
      'success' => false,
    ];

    try {
      $parse_cls = $this->analyzeClass($class, $type);
      if (!empty($parse_cls)) {
        return $this->modify($class, $data, $parse_cls, $type);
      }
    }
    catch (Exception $e) {
      // If an exception is caught, set an error message in the result array.
      $res["error"] = $e->getMessage();
    }
    return $res;
  }


  public function modifyBlock(string $class, array $data, string $type = 'libclass')
  {
    
  }



  /**
   * Create a new PHP class file with a specified namespace and class name.
   *
   * @param string $namespace The namespace for the new class.
   * @param string $classname The name of the new class.
   *
   * @return array An array containing information about the success of class creation and the file path.
   */
  public function createNewClass(string $namespace, string $classname): array
  {
    $res = [
      'success' => false
    ];

    try {
      // Define the directory path for class creation and the composer.json file path.
      $dir = $this->dir . $this->defaultDir;
      $composer = $dir . "/composer.json";
      $lib_path = "";

      // Get PSR autoloader information from the composer.json file.
      $psr_infos = $this->getPsrInfos($composer, 'autoload');

      if (!is_null($psr_infos)) {
        $psr_keys = $psr_infos['psr_keys'];
        $psr_value = $psr_infos['psr_value'];

        // Check if there is only one PSR-4 autoloading entry.
        if (count($psr_keys) == 1) {
            $libnamespace = $psr_keys[0];
            $lib_path = $psr_value[$libnamespace];
        }
      }

      // Append the library path to the directory path if it exists.
      $lib_path = $lib_path !== "" ? '/' . $lib_path : '';

      // Create the content for the new PHP class file.
      $content = '<?php' . PHP_EOL . PHP_EOL . 'namespace ' . $namespace . ';' . PHP_EOL . PHP_EOL;
      $content .= 'class ' . $classname . PHP_EOL . '{' . PHP_EOL . PHP_EOL . '}' . PHP_EOL;

      // Define the file path for the new PHP class file.
      $class_file = $dir . $lib_path . '/' . str_replace('\\', '/', $namespace) . '/' . $classname . '.php';

      // Write the content to the class file.
      file_put_contents($class_file, $content);

      // Set the "success" flag to true to indicate successful class creation.
      $res['success'] = true;

      // Store the file path of the created class file in the result array.
      $res['filepath'] = $class_file;
    } catch (Exception $e) {
      // If an exception occurs, capture the error message.
      $res["error"] = $e->getMessage();
    }

    // Return the result array containing class creation status and file path.
    return $res;
  }



  /**
   * Check if a given operation is valid based on the provided parse data and name.
   *
   * @param string $operation The operation to check ('method', 'property', or 'constant').
   * @param array $parse_cls Parsed class data containing methods, properties, and constants.
   * @param string $name The name to check within the parsed class data.
   *
   * @return bool True if the operation is valid; otherwise, false.
   *
   * @throws Exception If an invalid operation is provided.
   */
  public function checkErr(string $operation, array $parse_cls, string $name): bool
  {
    switch ($operation) {
      case 'method':
        // Check if the name exists as a method in the parsed class data.
        if (!empty($parse_cls['methods'][$name])) {
          return true;
        }
        return false;
        break;
      case 'property':
        // Check if there are properties in the parsed class data.
        if (!empty($parse_cls['properties'])) {
          // Check if the name exists in the list of properties.
          if (in_array($name, array_keys($parse_cls['properties']))) {
            return true;
          }
        }
        return false;
        break;
      case 'constant':
        // Check if the name exists as a constant in the parsed class data.
        if (!empty($parse_cls['constants'][$name])) {
          return true;
        }
        return false;
        break;
      default:
        // Throw an exception if an invalid operation is provided.
        throw new Exception(X::_("Only the following words are allowed: 'method', 'property', 'constant'"));
    }
  }



  /**
   * Get the line number associated with a given operation and data within parsed class data.
   *
   * @param string $operation The operation ('method' or another operation).
   * @param array $data Data related to the operation, including a 'line' value.
   * @param array $parse_cls Parsed class data containing start and end line information.
   *
   * @return int The line number associated with the operation.
   */
  public function getLine(string $operation, array $data, array $parse_cls): int
  {
    $line = 0;

    if ($operation === 'method') {
      // If the operation is 'method', determine the line based on the 'line' value.
      if ($data['line'] === 'Eof') {
        // If 'line' is 'Eof', set the line number to the end line minus 1.
        $line = $parse_cls['endLine'] - 1;
      } else {
        // Otherwise, set the line number to the value of 'line'.
        $line = $data['line'];
      }
    } else {
      // For operations other than 'method', set the line to the start line plus 1.
      $line = $parse_cls['startLine'] + 1;
    }

    return $line;
  }


  private function getConfig(string $type, array $data): array
  {
    if ($type === 'libclass') {
      return [
        'operation' => 'analyzeClass',
        'class' => $data['class'],
        'lib' => $this->lib,
        'dir' => $this->dir . $this->defaultDir
      ];
    } else {
      return [
        'operation' => 'analyzeTestClass',
        'dir' => $this->dir . $this->defaultDir,
        'testdir' => $data['testdir'],
        'testclass' => $data['class']
      ];
    }
  }



  private function process(string $operation, array $cfg, array $data, array $parse_cls)
  {
    $res = [
      'success' => false,
    ];
  
    try {
      if ($this->checkErr($operation, $parse_cls, $data['name'])) {
        $res["error"] = $operation . ' ' . $data['name'] . ' already exists in ' . $data['class'];
      }
      else {
        $line = $this->getLine($operation, $data, $parse_cls);
        $classFile = $parse_cls['fileName'];
        if ($operation === 'method') {
          $arr = array_map(
            function($elem) {
              return (!empty($elem)) ? ('  ' . $elem) : $elem;
            }, 
            X::split($data['code'], PHP_EOL)
          );
          array_unshift($arr, "");
          $code = $arr;
        }
        else {
          $code = X::split($data['code'], PHP_EOL);
        }
        $originalclass = X::split(file_get_contents($classFile), PHP_EOL);
        $linesClass = $originalclass;
        array_splice($linesClass, $line, 0, $code);
        $newClass = X::join($linesClass, PHP_EOL);
        file_put_contents($classFile, $newClass);
        $parse_cls = $this->execute($cfg);
        if (empty($parse_cls)) {
          $res['error'] = 'Unable to add '. $operation . ' ' . $data['name'] . ' in ' . $data['class'];
          $newClass = X::join($originalclass, PHP_EOL);
          file_put_contents($classFile, $newClass);
        }
        else {
          $res['success'] = true;
        }
      }
    }
    catch (Exception $e) {
      // If an exception occurs, capture the error message.
      $res["error"] = $e->getMessage();
    }
    return $res;
  }



  /**
   * Create a new class, method, property, or constant in a PHP class file based on the provided operation and data.
   *
   * @param string $operation The operation ('method', 'property', 'constant') to perform.
   * @param array $data Data containing information about the operation, including class, name, code, and test directory (if applicable).
   * @param string $type The type of operation ('libclass' or 'testclass'). Defaults to 'libclass'.
   *
   * @return array An array indicating the success or failure of the operation.
   */
  public function create(string $operation, array $data, string $type = 'libclass'): array
  {
    $res = [
      'success' => false
    ];

    try {
      $cfg = $this->getConfig($type, $data);
      $parse_cls = $this->execute($cfg);
      if (!empty($parse_cls)) {
        $res = $this->process($operation, $cfg, $data, $parse_cls);
        $parse_cls = $this->execute($cfg);
        $generator = new Generator($parse_cls);
        $gen = $generator->generateClass();
        file_put_contents($parse_cls['fileName'], $gen);
      }
      else {
        $res['error'] = 'Class not exists or faulty!';
      }
    }
    catch (Exception $e) {
      // If an exception occurs, capture the error message.
      $res["error"] = $e->getMessage();
    }
    return $res;
  }


  public function createBlock(string $operation, array $block, string $type = 'libclass'): array
  {
    $res = [
      'success' => false
    ];

    try {
      $cfg = $this->getConfig($type, $block['utils']);
      $parse_cls = $this->execute($cfg);
      if (!empty($parse_cls)) {
        $methods = $block['methods'];
        foreach ($methods as $method) {
          $tmp = $this->process($operation, $cfg, $method, $parse_cls);
          $res['success'] = $res['success'] || $tmp['success'];
          $res['error'] .= (!$tmp['success']) ? ($tmp['error'] . PHP_EOL) : ''; 
        }
        $parse_cls = $this->execute($cfg);
        $generator = new Generator($parse_cls);
        $gen = $generator->generateClass();
        file_put_contents($parse_cls['fileName'], $gen);
      }
      else {
        $res['error'] = 'Class not exists or faulty!';
      }
    }
    catch (Exception $e) {
      // If an exception occurs, capture the error message.
      $res["error"] = $e->getMessage();
    }
    return $res;
  }

  /**
   * Get a short code (prompt) based on the provided operation.
   *
   * @param string $operation The operation for which to retrieve the short code.
   *
   * @return string The short code (prompt) associated with the operation.
   *
   * @throws Exception If an invalid operation is provided.
   */
  private function getPromptShortCode(string $operation): string
  {
    switch ($operation) {
      case 'suggest-test':
        // If the operation is 'suggest-test', return the associated short code.
        return 'method-tests-json';
        break;
      case 'ai-refactoring':
        // If the operation is 'ai-refactoring', return the associated short code.
        return 'method-refactor-json';
        break;
      default:
        // Throw an exception if an invalid operation is provided.
        throw new Exception(X::_("Only the following words are allowed: 'suggest-test', 'ai-refactoring'"));
    }
  }



  public function makeAiRequest(string $operation, Ai $ai, string $function_code, int $retry = 3): array
  {
    $res = [
      'success' => false
    ];
    $short_code = $this->getPromptShortCode($operation);
    X::log("ShortCode: " . $short_code, 'ai_suggestion');
    try
    {
      $prompt = $ai->getPromptByShortcode($short_code);
      X::log("Prompt :", 'ai_suggestion');
      X::log($prompt, 'ai_suggestion');
      if (!empty($prompt)) {
        $response = $ai->getPromptResponse($prompt['id'], $function_code, false);
        X::log("Response:", 'ai_suggestion');
        X::log($response, 'ai_suggestion');
        if ($response['success']) {
          $content = $response['result']['content'];
          $arr = json_decode($content);
          X::log("Decoded content:", 'ai_suggestion');
          X::log($arr, 'ai_suggestion');
          $res['success'] = true;
          $res['data'] = (!empty($arr)) ? $arr : [];
          X::log("Data:", 'ai_suggestion');
          X::log($res, 'ai_suggestion');
        }
        else {
          $retry = $retry - 1;
          X::log("Retrying ....", 'ai_suggestion');
          X::log("Remaning Retry: " . $retry, 'ai_suggestion');
          if ($retry === 0) {
            $res['data'] = [];
            X::log("Data:", 'ai_suggestion');
            X::log($res, 'ai_suggestion');
          }
          else {
            $res = $this->makeAiRequest($operation, $ai, $function_code, $retry);
          }
        }
      }
      else {
        $res['success'] = false;
        $res["error"] = 'Unable to get OpenAi prompt for this operation.';
      }
    }
    catch (Exception $e) {
      // If an exception occurs, capture the error message.
      $res["error"] = $e->getMessage();
    }
    return $res;
  }


  private function createTestAutoloadFile(string $file_path, string $namespace, string $testdir): void
  {
    X::log('Creating Test autoload file ...', 'addtest');
    if (!file_exists($testdir)) {
      $this->fs->createPath($testdir);
    }
    $content = "<?php" .PHP_EOL.PHP_EOL.PHP_EOL. "include_once __DIR__.'/../vendor/autoload.php';";
    $content .= PHP_EOL.PHP_EOL.PHP_EOL. '$classLoader = new \Composer\Autoload\ClassLoader();';
    $content .= PHP_EOL. '$classLoader->addPsr4("' . $namespace . '\", __DIR__, true);';
    $content .= PHP_EOL. '$classLoader->register();' .PHP_EOL;
    file_put_contents($file_path, $content);
    X::log('Created ...', 'addtest');
  }


  private function addDefaultAutoloadDev(): bool
  {
    X::log('Adding autoload dev ...', 'addtest');
    $dir = $this->dir . $this->defaultDir;
    $composer = $dir . "/composer.json";

    if (file_exists($composer)) {
      $content = $this->fs->decodeContents($composer, null, true);
      $content['autoload-dev'] = [
        'psr-4' => [
          "tests\\" => "tests/"
        ]
      ];
      file_put_contents($composer, $content);
      $this->createTestAutoloadFile($dir . '/tests/autoload.php', 'tests\\', $dir . '/tests/');
      return true;
    }
    return false;
  }


  public function createTestClass(string $namespace, string $classname, string $originalclass): array
  {
    $res = [
      'success' => false
    ];

    try {
      $dir = $this->dir . $this->defaultDir;
      $composer = $dir . "/composer.json";
      $lib_path = "";
      $psr_infos = $this->getPsrInfos($composer, 'autoload-dev');
      
      if (!is_null($psr_infos)) {
        $psr_keys = $psr_infos['psr_keys'];
        $psr_value = $psr_infos['psr_value'];
        
        if (count($psr_keys) == 1) {
          $libnamespace = $psr_keys[0];
          $lib_path = $psr_value[$libnamespace];
        }
      }
      $lib_path = $lib_path !== "" ? '/' . $lib_path : '';
      $content = '<?php' . PHP_EOL . PHP_EOL . 'namespace ' . $namespace . ';' . PHP_EOL . PHP_EOL;
      $uses = 'use '. $originalclass . ';' . PHP_EOL . 'use PHPUnit\Framework\TestCase;' . PHP_EOL . PHP_EOL . PHP_EOL . PHP_EOL;
      $content .= $uses;
      $label = 'class ' . $classname . ' extends TestCase';
      $setUp = '  protected function setUp(): void' .PHP_EOL . '  {' . PHP_EOL . PHP_EOL . '  }';
      $tearDown = '  protected function tearDown(): void' .PHP_EOL . '  {' . PHP_EOL . PHP_EOL . '  }';
      $getInstance = '  public function getInstance(): void' .PHP_EOL . '  {' . PHP_EOL . PHP_EOL . '  }';
      $defaultFunctions = $setUp . PHP_EOL . PHP_EOL . $tearDown . PHP_EOL . PHP_EOL . $getInstance;
      $content .= $label . PHP_EOL . '{' . PHP_EOL . PHP_EOL . $defaultFunctions . PHP_EOL . PHP_EOL . '}' . PHP_EOL;
      $pth = str_replace($libnamespace, '', $namespace);
      $pth = str_replace('\\', '/', $pth);
      chdir($dir . $lib_path);
      mkdir($pth);
      $class_file = $dir . $lib_path . $pth . '/' . $classname . '.php';
      file_put_contents($class_file, $content);
      $res['success'] = true;
      $res['filepath'] = $class_file; 
    }
    catch (Exception $e) {
      // If an exception occurs, capture the error message.
      $res["error"] = $e->getMessage();
    }
    return $res;
  }


  private function prepareTestInsertion(string $class): bool
  {
    $res = false;
    try
    {
      X::log('Running Composer update ...', 'addtest');
      $this->composerAction('update');
      X::log('Done ...', 'addtest');
      $infos = $this->getTestNamespace($class);

      if (class_exists($infos['testclass'])) {
        X::log('Test class ' . $infos['testclass'] . ' exists ...', 'addtest');
        $res = true;
      }
      else {
        X::log('Test class ' . $infos['testclass'] . ' not exists ...', 'addtest');
        $testclass = $infos['testclass'];
        $spl = X::split($testclass, '\\');
        $classname = array_pop($spl);
        $namespace = '';

        if (count($spl) === 1) {
          $namespace = $spl[0];
        }
        else {
          foreach ($spl as $i => $part) {
            $namespace .= ($i < (count($spl) - 1)) ? $part . '\\' : $part;
          }
        }
        X::log('Creating Test class ' . $infos['testclass'], 'addtest');
        $op = $this->createTestClass($namespace, $classname, $class);
        if ($op['success']) {
          $res = true;
        }
        else {
          $res = false;
        }
      }
    }
    catch (Exception $e) {
      // If an exception occurs, capture the error message.
      X::log($e->getMessage(), 'addtest');
    }
    return $res;
  }


  public function addTestMethodsToClass(array $test, string $class, int $num = 0): array
  {
    $res = [
      'success' => false,
      'message' => ''
    ];
    X::log('Num: '. $num, 'addtest');
    try
    {
      $infos = $this->getTestNamespace($class);
      X::log('getting TestNamespace:', 'addtest');
      X::log($infos, 'addtest');
      if (!is_null($infos)) {
        X::log('Infos exists ...', 'addtest');
        $testdir = $infos['testdir'];
        $testnamespace = $infos['testnamespace'];
        if (!file_exists($testdir . '/autoload.php')) {
          X::log('Test autoload not exists ...', 'addtest');
          $this->createTestAutoloadFile(($testdir . 'autoload.php'), $testnamespace, $testdir);
          if ($num > 1) {
            throw new Exception("Infinite Loop");
          }
          X::log('Restarting ...', 'addtest');
          return $this->addTestMethodsToClass($test, $class, $num + 1);
        }
        else {
          X::log('Test autoload exists ...', 'addtest');
          $op = $this->prepareTestInsertion($class);
          //X::ddump($op);
          if ($op) {
            X::log('All Things ready for the insertion ...', 'addtest');
            $block = [
              'utils' => [
                'testdir' => $testdir,
                'class' => $infos['testclass'],
              ],
              'methods' => [],
            ];
            //$this->composerAction('update');
            foreach ($test as $t) {
              $data = [
                'name' => $t['name'],
                'code' => $t['code'],
                'line' => 'Eof'
              ];
              $block['methods'][] = $data;
            }
            X::log('Inserting ...', 'addtest');
            X::log($block, 'addtest');
            $res = $this->createBlock('method', $block, 'testclass');
            X::log($res, 'addtest');
            X::log("Well Done", 'addtest');
          }
          else {
            X::log("Insertion can't work", 'addtest');
            $res['success'] = false;
          }
          return $res;
        }
      }
      else {
        X::log('Infos not exists ...', 'addtest');
        $action = $this->addDefaultAutoloadDev();
        if ($action) {
          X::log('Autoload added ...', 'addtest');
          if ($num > 1) {
            throw new Exception("Infinite Loop");
          }
          X::log('Restarting ...', 'addtest');
          return $this->addTestMethodsToClass($test, $class, $num + 1);
        }
        else {
          X::log('Autoload failed adding ...', 'addtest');
          $res["success"] = false;
          return $res;  
        }
      }
    }
    catch (Exception $e) {
      // If an exception occurs, capture the error message.
      $res["error"] = $e->getMessage();
    }
    return $res;
  }
}
