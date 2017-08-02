<?php
/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 04/02/2017
 * Time: 15:56
 */

class ide {

  const BBN_APPUI = 'appui',
        BBN_PERMISSIONS = 'permissions',
        BBN_PAGE = 'page',
        IDE_PATH = 'ide',
        DEV_PATH = 'PATHS',
        PATH_TYPE = 'PTYPES',
        FILES_PREF = 'files';

  private static
    /** @var bool|int $appui_path */
    $ide_path = false,
    /** @var bool|int $dev_path */
    $dev_path = false,
    /** @var bool|int $path_type */
    $path_type = false,
    /** @var bool|int $files_pref */
    $files_pref = false,
    /** @var bool|int $permissions */
    $permissions = false,
    /** @var bool|string $current_file */
    $current_file = false,
    /** @var bool|string $current_id */
    $current_id = false;

  protected
    /** @var \bbn\appui\options $options */
    $options,
    /** @var null|string The last error recorded by the class */
    $last_error,
    /** @var array MVC routes for linking with repositories */
    $routes = [],
    /** @var \bbn\user\preferences $pref */
    $pref;

  /**
   * Gets the ID of the development paths option
   *
   * @return int
   */
  private function _ide_path(){
    if ( !self::$ide_path ){
      if ( $id = $this->options->from_code(self::IDE_PATH, self::BBN_APPUI) ){
        self::set_ide_path($id);
      }
    }
    return self::$ide_path;
  }

  /**
   * Sets the root of the development paths option
   *
   * @param $id
   */
  private static function set_ide_path($id){
    self::$ide_path = $id;
  }

  /**
   * Gets the ID of the development paths option
   *
   * @return int
   */
  private function _dev_path(){
    if ( !self::$dev_path ){
      if ( $id = $this->options->from_code(self::DEV_PATH, self::_ide_path()) ){
        self::set_dev_path($id);
      }
    }
    return self::$dev_path;
  }

  /**
   * Sets the root of the development paths option
   *
   * @param $id
   */
  private static function set_dev_path($id){
    self::$dev_path = $id;
  }

  /**
   * Gets the ID of the page (permissions) option
   *
   * @return int
   */
  private function _permissions(){
    if ( !self::$permissions ){
      if ( $id = $this->options->from_code(self::BBN_PAGE, self::BBN_PERMISSIONS, self::BBN_APPUI) ){
        self::set_permissions($id);
      }
    }
    return self::$permissions;
  }

  /**
   * Sets the ID of the page (permissions) option
   *
   * @param int $id
   */
  private static function set_permissions(int $id){
    self::$permissions = $id;
  }


  /**
   * Gets the ID of the paths' types option
   *
   * @return int
   */
  private function _files_pref(){
    if ( !self::$files_pref ){
      if ( $id = $this->options->from_code(self::FILES_PREF, $this->_ide_path()) ){
        self::set_files_pref($id);
      }
    }
    return self::$files_pref;
  }

  /**
   * Sets the root of the files' preferences option
   *
   * @param int $id
   */
  private static function set_files_pref(int $id){
    self::$files_pref = $id;
  }

  /**
   * Sets the current file path
   *
   * @param string $file
   * @return string|false
   */
  private function set_current_file(string $file = null){
    if ( empty($file) ){
      self::$current_file = false;
      return false;
    }
    self::$current_file = $file;
    $this->set_current_id();
    return self::$current_file;
  }

  /**
   * Sets the current file's ID
   *
   * @param string $file
   * @param string $bbn_path
   * @return string
   */
  private function set_current_id(string $file = null, string $bbn_path = null){
    self::$current_id = false;
    if ( empty($file) ){
      $file = self::$current_file;
    }
    if ( !empty($file) ){
      if ( empty($bbn_path) && ($url = $this->real_to_url($file)) ){
        $repository = self::repository_from_url($url, true);
        if ( !empty($repository) && defined($repository['bbn_path']) ){
          $bbn_path = $repository['bbn_path'];
        }
      }
      if ( !empty($bbn_path) && defined($bbn_path) && (strpos($file, constant($bbn_path)) === 0) ){
        self::$current_id = str_replace(constant($bbn_path), $bbn_path.'/', $file);
      }
    }
    return self::$current_id;
  }

  /**
   * Resets the current file's info
   */
  private function reset_current(){
    $this->set_current_file();
  }

  /**
   * Gets the option's ID for file's preferences
   *
   * @param string $id_file The file's ID
   * @return int|false
   */
  private function option_id(string $id_file = null){
    if ( empty($id_file) ){
      $id_file = self::$current_id;
    }
    if ( !empty($id_file) ){
      if ( !$id = $this->options->from_code($id_file, $this->_files_pref()) ){
        $id = $this->options->add([
          'id_parent' => $this->_files_pref(),
          'code' => $id_file,
          'text' => $id_file,
          'value' => NULL
        ]);
      }
      return $id;
    }
    return false;
  }

  /**
   * Sets the last error as the given string.
   *
   * @param string $st
   * @return string
   */
  protected function error(string $st){
    \bbn\x::log($st, "ide");
    $this->last_error = $st;
    return $this->last_error;
  }

  /**
   * Returns true if the error function has been called.
   *
   * @return bool
   */
  public function has_error(){
    return !empty($this->last_error);
  }

  /**
   * Returns last recorded error, and null if none.
   *
   * @return mixed last recorded error, and null if none
   */
  public function get_last_error(){
    return $this->last_error;
  }

  /**
   * ide constructor.
   *
   * @param \bbn\appui\options $options
   * @param $routes
   * @param \bbn\user\preferences $pref
   */
  public function __construct(bbn\appui\options $options, $routes, \bbn\user\preferences $pref){
    $this->options = $options;
    $this->routes = $routes;
    $this->pref = $pref;
    $this->_ide_path();
  }

  /**
   * Make repositories' configurations
   *
   * @param string|bool $code The repository's name (code)
   * @return array|bool
   */
  public function repositories($code=false){
    $all = $this->options->full_soptions(self::_dev_path());
    $cats = [];
    $r = [];
    foreach ( $all as $a ){
      if ( defined($a['bbn_path']) ){
        $k = $a['bbn_path'] . '/' . ($a['code'] === '/' ? '' : $a['code']);
        if ( !isset($cats[$a['id_alias']]) ){
          unset($a['alias']['cfg']);
          $cats[$a['id_alias']] = $a['alias'];
        }
        unset($a['cfg']);
        unset($a['alias']);
        $r[$k] = $a;
        $r[$k]['title'] = $r[$k]['text'];
        $r[$k]['alias_code'] = $cats[$a['id_alias']]['code'];
        if ( !empty($cats[$a['id_alias']]['tabs']) ){
          $r[$k]['tabs'] = $cats[$a['id_alias']]['tabs'];
        }
        else{
          $r[$k]['extensions'] = $cats[$a['id_alias']]['extensions'];
        }
        unset($r[$k]['alias']);
      }
    }
    if ( $code ){
      return isset($r[$code]) ? $r[$code] : false;
    }
    return $r;
  }

  /**
   * Gets a repository's configuration
   *
   * @param string $code The repository's name (code)
   * @return array|bool
   */
  public function repository($code){
    return $this->repositories($code);
  }

  /**
   * Returns the repository's name from an URL
   *
   * @param string $url
   * @param bool $obj
   * @return bool|int|string
   */
  public function repository_from_url(string $url, bool $obj = false){
    $repository = '';
    $repositories = $this->repositories();
    foreach ( $repositories as $i => $d ){
      if ( (strpos($url, $i) === 0) &&
        (strlen($i) > strlen($repository) )
      ){
        $repository = $i;
      }
    }
    return empty($obj) ? $repository : $repositories[$repository];
  }

  /***
   * Returns the filename and relative path from an URL
   *
   * @param string $url
   * @return bool|string
   */
  public function file_from_url(string $url){
    $rep = $this->repository_from_url($url);
    if ( $this->is_MVC($rep) ){
      $last = basename($url);
      if ( $repo = $this->repository($rep) ){
        $path = $this->get_root_path($rep).substr($url, strlen($rep));
        $tabs = $repo['tabs'];
        foreach ( $tabs as $key => $r ){
          if ( $key === $last ){
            foreach ( $tabs as $key2 => $r2 ){
              foreach ( $r2['extensions'] as $ext ){
                if ( is_file($path.'.'.$ext['ext']) ){
                  goto endFunc;
                }
              }
            }
            $url = dirname($url);
            break;
          }
        }
      }
    }
    endFunc:
    return substr($url, strlen($rep));
  }

  /**
   * Checks if a repository is a MVC
   *
   * @param string $rep
   * @return bool
   */
  public function is_MVC(string $rep){
    return isset($this->repository($rep)['tabs']);
  }

  /**
   * Checks if a repository is a MVC from URL
   *
   * @param string $url
   * @return bool
   */
  public function is_MVC_from_url(string $url){
    return $this->is_MVC($this->repository_from_url($url));
  }

  /**
   *
   *
   * @param string $st
   * @return bool|string
   */
  public function decipher_path($st){
    $st = bbn\str::parse_path($st);
    $bits = explode('/', $st);
    /** @var string $constant The first path of the path which might be a constant */
    $constant = $bits[0];
    /** @var string $path The path that will be returned */
    $path = '';
    if ( defined($constant) ){
      $path .= constant($constant);
      array_shift($bits);
    }
    $path .= implode('/', $bits);
    return $path;
  }

  /**
   * Gets the real root path from a repository's id as recorded in the options.
   *
   * @param string|array $repository The repository's name (code) or the repository's configuration
   * @return bool|string
   */
  public function get_root_path($repository){
    if ( is_string($repository) ){
      $repository = $this->repository($repository);
    }
    if ( !empty($repository) && !empty($repository['bbn_path']) ){
      $repository_path = !empty($repository['path']) ? '/' . $repository['path'] : '';
      $path = $this->decipher_path(bbn\str::parse_path($repository['bbn_path'] . $repository_path)) . '/';
      return bbn\str::parse_path($path);
    }
    return false;
  }

  /**
   * Loads a file.
   *
   * @param string $url File's URL
   * @return array|bool
   */
  public function load(string $url){
    if ( ($real = $this->url_to_real($url, true)) &&
      !empty($real['file']) &&
      !empty($real['mode']) &&
      !empty($real['repository'])
    ){
      $this->set_current_file($real['file']);
      $f = [
        'mode' => $real['mode'],
        'tab' => $real['tab'],
        'extension' => \bbn\str::file_ext(self::$current_file),
        'permissions' => false,
        'selections' => false,
        'marks' => false,
      ];
      if ( is_file(self::$current_file) ){
        $f['value'] = file_get_contents(self::$current_file);
        if ( $permissions = $this->get_file_permissions() ){
          $f = array_merge($f, $permissions);
        }
        if ( $preferences = $this->get_file_preferences() ){
          $f = array_merge($f, $preferences);
        }
      }
      else if ( !empty($real['tab']) &&
        !empty($real['repository']['tabs'][$real['tab']]['extensions'][0]['default'])
      ){
        $f['value'] = $real['repository']['tabs'][$real['tab']]['extensions'][0]['default'];
      }
      else if (!empty($real['repository']['extensions'][0]['default'])){
        $f['value'] = $real['repository']['extensions'][0]['default'];
      }
      else {
        $f['value'] = '';
      }
      $f['id'] = self::$current_id;
      return $f;
    }
    return false;
  }

  /**
   * Saves a file.
   *
   * @param array $file
   * @return array|string
   */
  public function save(array $file){
    if ( $this->set_current_file($this->decipher_path($file['full_path'])) ){

      // Delete the file if code is empty and if it isn't a super controller
      if ( empty($file['code']) && ($file['tab'] !== '_ctrl') ){
        if ( @unlink(self::$current_file) ){
          // Remove permissions
          $this->delete_perm();
          // Delete preferences
          if ( $this->pref ){
            $this->delete_file_preferences();
          }
          if ( !empty(self::$current_id) && defined('BBN_USER_PATH') && !empty($file['extension']) ){
            // Remove file's preferences
            $this->options->remove($this->options->from_code(self::$current_id, $this->_files_pref()));
            // Remove ide backups
            bbn\file\dir::delete(dirname(BBN_USER_PATH . 'ide/backup/' . self::$current_id) . '/' . ($file['tab'] ?: $file['extension']) . '/', 1);
          }
          return ['deleted' => true];
        }
      }
      if ( is_file(self::$current_file) && !empty(self::$current_id) && defined('BBN_USER_PATH') ){
        $backup = dirname(BBN_USER_PATH . 'ide/backup/' . self::$current_id) . '/' . ($file['tab'] ?: $file['extension']) . '/' . date('Y-m-d His') . '.' . $file['extension'];
        bbn\file\dir::create_path(dirname($backup));
        rename(self::$current_file, $backup);
      }
      else if ( !is_dir(dirname(self::$current_file)) ){
        bbn\file\dir::create_path(dirname(self::$current_file));
      }
      if ( ($file['tab'] === 'php') && !is_file(self::$current_file) ){
        // @todo create permission
      }
      file_put_contents(self::$current_file, $file['code']);
      if ( $this->pref ){
        $this->set_file_preferences(md5($file['code']), $file);
      }
      return ['success' => true];
    }
    return $this->error('Error: Save');
  }

  /**
   * Creates a new file|directory
   *
   * @param array $cfg
   * @return bool
   */
  public function create(array $cfg){
    if ( !empty($cfg['repository']) &&
      !empty($cfg['bbn_path']) &&
      !empty($cfg['rep_path']) &&
      !empty($cfg['name']) &&
      !empty($cfg['path']) &&
      isset($cfg['is_file'], $cfg['extension'], $cfg['default_text'])
    ){
      $path = $this->decipher_path($cfg['bbn_path'] . '/' . $cfg['rep_path']);
      if ( !empty($cfg['tab_path']) ){
        $path .= $cfg['tab_path'];
      }
      if ( $cfg['path'] !== './' ){
        $path .= $cfg['path'];
      }
      if ( empty($cfg['is_file']) ){
        if ( is_dir($path.$cfg['name']) ){
          $this->error("Directory exists");
          return false;
        }
        if ( !\bbn\file\dir::create_path($path.$cfg['name']) ){
          $this->error("Impossible to create the directory");
          return false;
        }
      }
      else if ( !empty($cfg['is_file']) && !empty($cfg['extension']) && !empty($cfg['default_text']) ){
        $file = $path . $cfg['name'] . '.' . $cfg['extension'];
        if ( !is_dir($path) && !\bbn\file\dir::create_path($path) ){
          $this->error("Impossible to create the container directory");
          return false;
        }
        if ( is_dir($path) ){
          if ( is_file($file) ){
            $this->error("File exists");
            return false;
          }
          if ( !file_put_contents($file, $cfg['default_text']) ){
            $this->error("Impossibile to create the file");
            return false;
          }
        }
        /** @todo create permission */
        // Add item to options table for permissions
        /*if ( !empty($cfg['tab']) && ($cfg['tab'] === 'php') ){
          if ( !$this->create_perm_by_real($file) ){
            return $this->error("Impossible to create the option");
          }
        }*/
      }
      return true;
    }
    return false;
  }

  /**
   * Gets file's permissions
   *
   * @param string $file The file's path
   * @return array|false
   */
  public function get_file_permissions(string $file = null){
    if ( empty($file) ){
      $file = self::$current_file;
    }
    if ( !empty($file) &&
      ($id_opt = $this->real_to_perm($file)) &&
      ($opt = $this->options->option($id_opt))
    ){
      $ret = [
        'permissions' => [
          'id' => $opt['id'],
          'code' => $opt['code'],
          'text' => $opt['text'],
          'children' => []
        ]
      ];
      if ( isset($opt['help']) ){
        $ret['permissions']['help'] = $opt['help'];
      }
      $sopt = $this->options->full_options($opt['id']);
      foreach ( $sopt as $so ){
        array_push($ret['permissions']['children'], [
          'code' => $so['code'],
          'text' => $so['text']
        ]);
      }
      return $ret;
    }
    return false;
  }

  /**
   * Deletes permission from a real file's path
   *
   * @param string $file The real file's path
   * @return bool
   */
  public function delete_perm($file = null){
    if ( empty($file) ){
      $file = self::$current_file;
    }
    if ( !empty($file) && ($id_opt = $this->real_to_perm($file)) && $this->options->remove($id_opt) ){
      return true;
    }
    return false;
  }

  /**
   * Gets file's preferences
   *
   * @param string $file The file's path
   * @return array|bool
   */
  public function get_file_preferences(string $file = null){
    if ( !empty($file) && ($file !== self::$current_file) ){
      $this->set_current_file($file);
    }
    if ( !empty(self::$current_id) &&
      ($id_option = $this->options->from_code(self::$current_id, $this->_files_pref()))
    ){
      $o = $this->pref->get($id_option);
      return [
        'selections' => $o['selections'] ?: [],
        'marks' => $o['marks'] ?: []
      ];
    }
    return false;
  }

  /**
   * Sets user's preferences for a file.
   *
   * @param string $md5 The file's md5
   * @param array $cfg The user's preferences
   * @param string $id_file The file's id
   * @return bool
   */
  public function set_file_preferences(string $md5, array $cfg, string $id_file = null){
    if ( empty($id_file) ){
      $id_file = self::$current_id;
    }
    if ( !empty($id_file) && !empty($this->pref) && preg_match('/^[a-f0-9]{32}$/i', $md5) && !empty($cfg) ){
      $c['md5'] = $md5;
      if ( isset($cfg['selections']) ){
        $c['selections'] = $cfg['selections'];
      }
      if ( isset($cfg['marks']) ){
        $c['marks'] = $cfg['marks'];
      }
      if ( ($id_option = $this->option_id()) && $this->pref->set($id_option, $c) ){
        return true;
      }
    }
    return false;
  }

  /**
   * Removes a file from preferences
   *
   * @param string|null $id_file The file's ID
   * @return bool
   */
  public function delete_file_preferences(string $id_file = null){
    if ( empty($id_file) ){
      $id_file = self::$current_id;
    }
    if ( !empty($id_file) && ($id_option = $this->option_id()) && $this->options->remove($id_option) ){
      return true;
    }
  }

  /**
   * Returns the permission's id from a real file/dir's path
   *
   * @param string $file The real file/dir's path
   * @return bool|int
   */
  public function real_to_perm(string $file){
    if ( empty($file) ){
      $file = self::$current_file;
    }
    if ( !empty($file) &&
      defined('BBN_APP_PATH') &&
      // It must be a controller
      (strpos($file, '/mvc/public/') !== false)
    ){
      // Check if it's an external route
      foreach ( $this->routes as $i => $r ){
        if ( strpos($file, $r) === 0 ){
          // Remove route
          $f = substr($file, strlen($r), strlen($file));
          // Remove /mvc/public
          $f = substr($f, strlen('/mvc/public'), strlen($f));
          // Add the route's name to path
          $f = $i . $f;
          break;
        }
      }
      // Internal route
      if ( empty($f) ){
        $root_path = BBN_APP_PATH.'mvc/public/';
        if ( strpos($file, $root_path) === 0 ){
          // Remove root path
          $f = substr($file, strlen($root_path), strlen($file));
        }
      }
      if ( !empty($f) ){
        $bits = bbn\x::remove_empty(explode('/', $f));
        $file_code = bbn\str::file_ext(array_pop($bits), 1)[0];
        $bits = array_map(function($b){
          return $b.'/';
        }, array_reverse($bits));
        array_unshift($bits, $file_code);
        array_push($bits, $this->_permissions());
        return $this->options->from_code($bits);
      }
    }
    return false;
  }

  /**
   * Returns the file's URL from the real file's path.
   *
   * @param string $file The real file's path
   * @return bool|string
   */
  public function real_to_url(string $file){
    foreach ( $this->repositories() as $i => $d ){
      // Repository's root path
      $root = $this->get_root_path($d);
      if ( strpos($file, $root) === 0 ){
        $res = $i . '/';
        $bits = explode('/', substr($file, strlen($root)));
        // MVC
        if ( !empty($d['tabs']) ){
          $tab_path = array_shift($bits);
          $fn = array_pop($bits);
          $ext = \bbn\str::file_ext($fn);
          $fn = \bbn\str::file_ext($fn, 1)[0];
          $res .= implode('/', $bits);
          foreach ( $d['tabs'] as $t ){
            if ( empty($t['fixed']) &&
              ($t['path'] === $tab_path . '/')
            ){
              $res .= "/$fn/$t[url]";
              break;
            }
          }
        }
        // Normal file
        else {
          $res .= implode('/', $bits);
        }
        return \bbn\str::parse_path($res);
      }
    }
    return false;
  }

  /**
   * Gets the real file's path from an URL
   *
   * @param string $url The file's URL
   * @param bool $obj
   * @return bool|string|array
   */
  public function url_to_real(string $url, bool $obj = false){
    if ( ($rep = $this->repository_from_url($url, true)) &&
      ($res = $this->get_root_path($rep))
    ){
      $bits = explode('/', substr($url, strlen($rep['bbn_path'].$rep['path'])+1));
      $o = [
        'mode' => false,
        'repository' => $rep,
        'tab' => false
      ];
      if ( !empty($bits) ){
        if ( !empty($rep['tabs']) && (end($bits) !== 'code') ){
          // Tab's nane
          $tab = array_pop($bits);
          // File's name
          $fn = array_pop($bits);
          // File's path
          $fp = implode('/', $bits);
          // Check if the file is a superior super-controller
          $ssc = $this->superior_sctrl($tab, $fp);
          $tab = $ssc['tab'];
          $o['tab'] = $tab;
          $fp = $ssc['path'].'/';
          if ( !empty($rep['tabs'][$tab]) ){
            $tab = $rep['tabs'][$tab];
            $res .= $tab['path'];
            if ( !empty($tab['fixed']) ){
              $res .= $fp . $tab['fixed'];
              $o['mode'] = $tab['extensions'][0]['mode'];
            }
            else {
              $res .= $fp . $fn;
              $ext_ok = false;
              foreach ( $tab['extensions'] as $e ){
                if ( is_file("$res.$e[ext]") ){
                  $res .= ".$e[ext]";
                  $ext_ok = true;
                  $o['mode'] = $e['mode'];
                  break;
                }
              }
              if ( empty($ext_ok) ){
                $res .= '.' . $tab['extensions'][0]['ext'];
                $o['mode'] = $tab['extensions'][0]['mode'];
              }
            }
          }
          else {
            return false;
          }
        }
        else {
          array_pop($bits);
          $res .= implode('/', $bits);
          foreach ( $rep['extensions'] as $ext ){
            if ( is_file("$res.$ext[ext]") ){
              $res .= ".$ext[ext]";
              $o['mode'] = $ext['mode'];
            }
          }
          if ( empty($o['mode']) ){
            $res .= '.' . $rep['extensions'][0]['ext'];
            $o['mode'] = $rep['extensions'][0]['mode'];
          }
        }
        $res = bbn\str::parse_path($res);
        if ( $obj ){
          $o['file'] = $res;
          return $o;
        }
        return $res;
      }
    }
    return false;
  }

  /**
   * Checks if the file is a superior super-controller and returns the corrected name and path
   *
   * @param string $tab The tab'name from file's URL
   * @param string $path The file's path from file's URL
   * @return array
   */
  private function superior_sctrl(string $tab, string $path = ''){
    if ( ($pos = strpos($tab, '_ctrl')) > -1 ){
      if ( ($pos === 0) ){
        $path = '';
      }
      else {
        // Fix the right path
        $bits = explode('/', $path);
        $count = strlen(substr($tab, 0, $pos));
        if ( !empty($bits) ){
          foreach ( $bits as $i => $b ){
            if ( ($i + 1) > $count ){
              unset($bits[$i]);
            }
          }
          $path = implode('/', $bits). '/';
        }
      }
      // Fix the tab's name
      $tab = '_ctrl';
    }
    return [
      'tab' => $tab,
      'path' => $path
    ];
  }


}