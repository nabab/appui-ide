<?php

/**
 * This file deals with all the requests (users and API calls).
 *
 * Long description for file (if any)...
 *
 * - It should be auto-generated
 * - All these constants are mandatory.
 * - Deleting a line might crash the app.
 *
 * @category   CategoryName
 *
 * @author     Thomas Nabet <thomas.nabet@gmail.com>
 * @copyright  2008-2020 BBN Solutions
 * @license    http://www.php.net/license/3_01.txt  PHP License 3.01
 *
 * @version    SVN: $Id$
 *
 * @see       http://pear.php.net/package/PackageName
 * @see        mvc
 */
(function ($installer) {
    global $argv;
    $params = $argv[2] ? json_decode($argv[2], true) : [];
    //die(json_encode($params));

  /** @todo Not sure why... */
  @ini_set('zlib.output_compression', 'off');
  /** The only/main object */
  $bbn = new stdClass();
  $bbn->is_cli = php_sapi_name() === 'cli';
  $errorFn = function ($msg) use (&$bbn) {
    $st = sprintf('
The following error occurred: %s.

In order to repair or redo your installation you need to download the following script:
<a href="https://app-ui.com/download/bbn-install.php">bbn-install.php</a>
and put it in the public root of your web server and call it from your browser.
', $msg);
    if ($bbn->is_cli) {
      die($st);
    }

    die(nl2br($st));
  };

  $app_path = dirname(getcwd()) . '/';
  $hostname = gethostname();
  if (is_file('.bbn')) {
    $cFile = file_get_contents('.bbn');
    try {
      $cJson = json_decode($cFile, true);
    }
    catch (Exception $e) {
      $cJson = [
        'updating' => false,
        'data' => [],
        'time' => 0
      ];
    }

    // Good environment
    if (($cJson['data']['hostname'] === $hostname)
        && ($cJson['data']['app_path'] === $app_path)) {
          // Another process updates or time is not up
      if (!empty($cJson['updating']) || (time() - $cJson['time'] < 60)) {
        $cfg = $cJson['data'];
      }
    }
  }

  if (!isset($cfg)) {
    $cJson['updating'] = true;
    file_put_contents('.bbn', json_encode($cJson, JSON_PRETTY_PRINT));
    /** @var string Current directory which MUST be the root of the project where the symlink to rhis file is located */
    // Parsing YAML environment's configuration
    if (
      function_exists('yaml_parse')
      && file_exists('cfg/environment.yml')
      && ($tmp = file_get_contents('cfg/environment.yml'))
    ) {
      /** @var array Environment's configuration */
      $cfgs = yaml_parse($tmp);
    }
    // Or parsing JSON environment's configuration
    elseif (
      function_exists('json_decode')
      && file_exists('cfg/environment.json')
      && ($tmp = file_get_contents('cfg/environment.json'))
    ) {
      /** @var array ENvironment's configuration */
      $cfgs = json_decode($tmp, true);
    }

    // If no readable environment's configuration is found the app is not configured correctly
    if (empty($cfgs)) {
      $errorFn("No environment files in $app_path    " . getcwd());
    }

    /** @var string The hostname */
    // Checking each configuration
    foreach ($cfgs as $c) {
      // Looking for the corresponding hostname and app path
      if (isset($c['hostname']) && ($c['hostname'] === $hostname) && ($c['app_path'] === $app_path)) {
        if (!empty($c['force_server_name'])) {
          if (
            !empty($c['server_name'])
            && ($c['server_name'] === $_SERVER['SERVER_NAME'])
          ) {
            $cfg = $c;
            break;
          }
        } else {
          /** @var array The current configuration */
          $cfg = $c;
          break;
        }
      }
    }

    // If no corresponding configuration is found the app is not configured correctly
    if (!isset($cfg)) {
      $errorFn('No parameter corresponding to the current configuration.' .
        PHP_EOL . PHP_EOL .
        'Your hostname: ' . $hostname . PHP_EOL .
        'Your app path: ' . $app_path .
        PHP_EOL . PHP_EOL . print_r(array_map(function ($a) {
          return [
            'env_name' => $a['env_name'],
            'hostname' => $a['hostname'],
            'server_name' => $a['server_name']
          ];
        }, $cfgs), true));
    }

    // Redirection to https in case of SSL configuration
    if (
      !$bbn->is_cli
      && !empty($cfg['is_ssl'])
      && ($_SERVER['REQUEST_SCHEME'] === 'http')
    ) {
      header('Location: https://' . $cfg['server_name'] . $_SERVER['REQUEST_URI']);
      exit;
    }

    /** @var mixed Temporary variable for the general settings, which should be an array */
    $tmp = false;
    if (function_exists('yaml_parse') && file_exists('cfg/settings.yml') && ($tmp = file_get_contents('cfg/settings.yml'))) {
      $tmp = yaml_parse($tmp);
    } elseif (function_exists('json_decode') && file_exists('cfg/settings.json') && ($tmp = file_get_contents('cfg/settings.json'))) {
      $tmp = json_decode($tmp, true);
    }

    // If no general setting is found the app is not configured correctly
    if (!$tmp) {
      $errorFn('impossible to read the configuration file (settings.json).');
    }

    // The cfg array becomes a mix of current environment and settings
    $cfg = array_merge($cfg, $tmp);
    if (!isset($cfg['tmp_path'])) {
      $home = getenv('HOME');
      if (empty($home)) {
        if (!empty($_SERVER['HOMEDRIVE']) && !empty($_SERVER['HOMEPATH'])) {
          // home on windows
          $home = $_SERVER['HOMEDRIVE'] . $_SERVER['HOMEPATH'];
        }
      }

      if (!$home || !is_dir("$home/tmp") || !is_writable("$home/tmp")) {
        $errorFn('Impossible to find the temporary path, please set it in the environment file as tmp_path.');
      }
      
      $cfg['tmp_path'] = "$home/tmp/$cfg[app_name]";
      if (!is_dir($cfg['tmp_path'])) {
        mkdir($cfg['tmp_path'], 0775, true);
      }
    }

    file_put_contents('.bbn', json_encode(['time' => time(), 'data' => $cfg], JSON_PRETTY_PRINT));
  }

  // Each value in thew array will define a constant with prefix BBN_
  foreach ($cfg as $n => $c) {
    if ($n === 'spec') {
      continue;
    }
    if ($n === 'env') {
      define('BBN_IS_DEV', $c === 'dev');
      define('BBN_IS_TEST', $c === 'test');
      define('BBN_IS_PROD', $c === 'prod');
    }

    /* @constant string BBN_SERVER_NAME The server's name as in the app's URL */
    /* @constant BBN_CUR_PATH */
    define('BBN_' . strtoupper($n), $c);
  }

  // Is SSL is false by default
  /** @todo change it? */
  if (!defined('BBN_IS_SSL')) {
    define('BBN_IS_SSL', false);
  }

  // Default web port
  if (!defined('BBN_PORT')) {
    define('BBN_PORT', BBN_IS_SSL ? 443 : 80);
  }

  /** The base URL of the application */
  $url = 'http'
    . (BBN_IS_SSL ? 's' : '')
    . '://' . BBN_SERVER_NAME
    . (BBN_PORT && !in_array(BBN_PORT, [80, 443]) ? ':' . BBN_PORT : '')
    . (BBN_CUR_PATH ? BBN_CUR_PATH : '');
  if (mb_substr($url, -1) !== '/') {
    $url .= '/';
  }

  define('BBN_URL', $url);

  // If the server name is different the request is redirected
  if (!$bbn->is_cli && ($_SERVER['SERVER_NAME'] !== BBN_SERVER_NAME)) {
    header('Location: ' . BBN_URL);
  }

  // In case app_prefix isn't defined we use app_name
  if (!defined('BBN_APP_PREFIX') && defined('BBN_APP_NAME')) {
    define('BBN_APP_PREFIX', BBN_APP_NAME);
  }

  if (isset($cfg['spec'])) {
    foreach ($cfg['spec'] as $key => $val) {
      define(strtoupper(BBN_APP_PREFIX) . '_' . strtoupper($key), $val);
    }
  }

  // Checking all the necessary constants are defined... or die
  if (
    !defined('BBN_LIB_PATH')
    || !defined('BBN_APP_PATH')
    || !defined('BBN_DATA_PATH')
    || !defined('BBN_APP_NAME')
    || !defined('BBN_TIMEZONE')
    || !defined('BBN_SESS_LIFETIME')
    || !defined('BBN_PUBLIC')
    || !defined('BBN_IS_DEV')
  ) {
    $errorFn('Sorry check your config file or rebuild it, all the necessaries variable are not there.');
  }

  // Classes autoloaders
  spl_autoload_register(
    function ($class_name) {
      if ((mb_strpos($class_name, '/') === false) && (mb_strpos($class_name, '.') === false)) {
        $cls = explode('\\', $class_name);
        $path = implode('/', $cls);
        if (file_exists(BBN_APP_PATH . 'src/lib/' . $path . '.php')) {
          include_once BBN_APP_PATH . 'src/lib/' . $path . '.php';
        }
      }
    }
  );

  // This application is in utf8
  mb_internal_encoding('UTF-8');

  // The default timezome of the site (before finding out about the user's timezone
  date_default_timezone_set(BBN_TIMEZONE);

  ini_set('error_log', BBN_DATA_PATH . 'logs/_php_error.log');
  //set_error_handler('\\bbn\\X::log_error', E_ALL);
  if (isset($params['dir'], $params['class'], $params['lib'])) {
    chdir($params['dir']);
    if ($params['lib'] === "bbn/bbn") {
      include_once 'vendor/autoload.php';
    }
    $ref = new ReflectionClass('bbn\\Parsers\\Php');
    
    $parser = new bbn\Parsers\Php();
    $data = $parser->analyzeClass($params['class']);
    $data['lib'] = $params['lib'];
    $data['file'] = $ref->getFileName();
    $data['loc'] = getcwd();
    die(json_encode($data));
  }
})($installer ?? null);
