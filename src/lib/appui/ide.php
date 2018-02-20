<?php
/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 04/02/2017
 * Time: 15:56
 */
namespace appui;

class ide {

  const BBN_APPUI = 'appui',
        BBN_PERMISSIONS = 'permissions',
        BBN_PAGE = 'page',
        IDE_PATH = 'ide',
        DEV_PATH = 'PATHS',
        PATH_TYPE = 'PTYPES',
        FILES_PREF = 'files',
        BACKUP_PATH = BBN_DATA_PATH . 'ide/backup/';

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
  private static function set_permissions($id){
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
  private static function set_files_pref(string $id){
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
        if ( !empty($repository) && \defined($repository['bbn_path']) ){
          $bbn_path = $repository['bbn_path'];
        }
      }
      if ( !empty($bbn_path) && \defined($bbn_path) && (strpos($file, constant($bbn_path)) === 0) ){
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
        $count = \strlen(substr($tab, 0, $pos));
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
      'path' => $path,
      'ssctrl' => $count ?? 0
    ];
  }

  /**
   * Deletes all files' options of a folder and returns an array of these files.
   *
   * @param string $d The folder's path
   * @return array
   */
  private function rem_dir_opt(string $d){
    $sub_files = \bbn\file\dir::scan($d);
    $files = [];
    foreach ( $sub_files as $sub ){
      if ( is_file($sub) ){
        // Add it to files to be closed
        array_push($files, $this->real_to_url($sub));
        // Remove file's options
        $this->options->remove($this->options->from_code($this->real_to_id($sub), $this->_files_pref()));
      }
      else {
        $f = $this->rem_dir_opt($sub);
        if ( !empty($f) ){
          $files = array_merge($files, $f);
        }
      }
    }
    return $files;
  }

  private function check_normal(array $cfg, array $rep, string $path){

    if ( !empty($cfg) && !empty($path) && !empty($cfg['name']) ){
      $old = $new = $path;
      if ( !empty($cfg['path']) && ($cfg['path'] !== './') ){
        $old .= $cfg['path'] . (substr($cfg['path'], -1) !== '/' ? '/' : '');
      }
      if ( !empty($cfg['new_path']) && ($cfg['new_path'] !== './') ){
        $new .= $cfg['new_path'] . (substr($cfg['new_path'], -1) !== '/' ? '/' : '');
      }
      if ( !empty($cfg['is_file']) &&
        ( ( !empty($cfg['ext']) && (\bbn\x::find($rep['extensions'], ['ext' => $cfg['ext']]) === false) ) ||
          ( !empty($cfg['new_ext']) && (\bbn\x::find($rep['extensions'], ['ext' => $cfg['new_ext']]) === false) )
        )
      ){
         return false;
      }
      $old .= $cfg['name'] . (!empty($cfg['is_file']) ? '.' . $cfg['ext'] : '');
      $new .= ($cfg['new_name'] ?? '') .
        (!empty($cfg['is_file']) && !empty($cfg['new_ext']) ? '.' . $cfg['new_ext'] : '');
      if ( ($path !== $new) && file_exists($new) ){

        $this->error("The new file|folder exists: $new");
        return false;
      }
      if ( file_exists($old) ){
        return [
          'old' => $old,
          'new' => ($path === $new) ? false : $new
        ];
      }
    }

    return false;
  }

  private function check_mvc(array $cfg, array $rep, string $path){
    $todo = [];

    if ( !empty($cfg) &&
      !empty($rep) &&
      !empty($rep['tabs']) &&
      !empty($cfg['name']) &&
      isset($cfg['is_file'], $path)
    ){


      // Each file associated with the structure (MVC case)
      foreach ( $rep['tabs'] as $i => $tab ){
        // The path of each file
        $tmp = $path;
        if ( !empty($tab['path']) ){
          $tmp .= $tab['path'];
        }

        $old = $new = $tmp;

        if ( !empty($cfg['path']) &&  ($cfg['path'] !== './') ){
          $old .= $cfg['path'] . (substr($cfg['path'], -1) !== '/' ? '/' : '');

        }
        if ( !empty($cfg['new_path']) && ($cfg['new_path'] !== './') ){
          $new .= $cfg['new_path'] . (substr($cfg['new_path'], -1) !== '/' ? '/' : '');

        }
        if ( ($i !== '_ctrl') && !empty($tab['extensions']) ){

          $old .= $cfg['name'];
          $new .= $cfg['new_name'] ?? '';
          $ext_ok = false;

          if ( !empty($cfg['is_file']) ){
            foreach ( $tab['extensions'] as $k => $ext ){
              if ( $k === 0 ){
                if ( !empty($cfg['new_name']) && is_file($new.'.'.$ext['ext']) ){
                  $this->error("The new file exists: $new.$ext[ext]");
                  return false;
                }
              }
              if ( is_file($old.'.'.$ext['ext']) ){
                $ext_ok = $ext['ext'];
              }
            }
          }
          if ( !empty($cfg['is_file']) && empty($ext_ok) ){
            continue;
          }
          $old .= !empty($cfg['is_file'])  ? '.' . $ext_ok : '';
          $new .= !empty($cfg['is_file']) ? '.' . $tab['extensions'][0]['ext'] : '';

          if ( !empty($cfg['new_name']) && ($new !== $tmp) && file_exists($new) ){
            $this->error("The new file|folder exists.");
            return false;
          }

          if ( file_exists($old) ){
            array_push($todo, [
              'old' => $old,
              'new' => ($new === $tmp) ? false : $new,
              'perms' => $i === 'php'
            ]);
          }
        }
      }
    }

    return $todo;
  }

  /**
   * Renames|movie a file or a folder of the backup.
   *
   * @param array $path paths of file|folder, old and new
   * @param array $cfg The file|folder info
   * @param string $ope The operation type (rename, copy)
   * @return bool
   */
  private function operations_backup(array $path,  array $cfg, string $case ){
    //set path backups temporaney disattivate for check an complete
    $backup_path = self::BACKUP_PATH . $cfg['repository']['bbn_path'] . '/' . $cfg['repository']['path'];
    //CASE RENAME
    if ( $case === 'rename' ){
      $old_backup = $backup_path . $cfg['bbn_path'] . $cfg['path'] . explode(".", array_pop(explode("/", $path['old'])))[0];
      $new_backup = $backup_path . $cfg['bbn_path'] . $cfg['path'] . explode(".", array_pop(explode("/", $path['new'])))[0];
    }
    //CASE MOVE
    if ( $case === 'move' ){
      $old_backup = $backup_path . $cfg['bbn_path'] . $cfg['path'] . explode(".", array_pop(explode("/", $path['old'])))[0];
      $new_backup = $backup_path . $cfg['bbn_path'] . $cfg['new_path'] .'/'. explode(".", array_pop(explode("/", $path['new'])))[0];
    }
    //if exist a backup
    if ( is_dir($old_backup) ){
      // if it isn't a folder
      if ( !is_dir($path['old']) && !is_dir($path['new']) ){
        if ( is_dir($old_backup . "/__end__") ){
          if ( !\bbn\file\dir::move($old_backup . "/__end__", $new_backup . "/__end__", false) ){
            $this->error("Error during the file|folder backup move: old -> $old_backup , new -> $new_backup");
          }
          else {
            if ( empty(\bbn\file\dir::get_dirs($old_backup)) ){
              if (!\bbn\file\dir::delete($old_backup)){
                $this->error("Error during the file|folder backup delete: old -> $old_backup , new -> $new_backup");
              }
            }
          }
        }
      } //case rename backup folder
      else {
        if ( \bbn\file\dir::copy($old_backup, $new_backup) ){
          if ( !\bbn\file\dir::delete($old_backup) ){
            $this->error("Error during the file|folder backup delete: old -> $old_backup , new -> $new_backup");
          }
        }
        else{
          $this->error("Error during the file|folder backup copy: old -> $old_backup , new -> $new_backup");
        }
      }
    }
  }

  /**
   * Renames|copies a file or a folder.
   *
   * @param array $cfg The file|folder info
   * @param string $ope The operation type (rename, copy)
   * @return bool
   */
  private function operations(array $cfg, string $ope){

    if ( is_string($ope) &&
      !empty($cfg['repository']) &&
      !empty($cfg['name']) &&
      isset($cfg['is_mvc'], $cfg['is_file'], $cfg['path']) &&
      ( ( $ope === 'delete' ) ||
        ( ( $ope !== 'delete' ) &&
          ( ( isset($cfg['new_name']) &&
              ($cfg['name'] !== $cfg['new_name'])
            ) ||
            ( isset($cfg['new_path']) &&
              ($cfg['path'] !== $cfg['new_path'])
            ) ||
            ( !empty($cfg['is_file']) &&
              isset($cfg['ext'], $cfg['new_ext']) &&
              ($cfg['ext'] !== $cfg['new_ext'])
            )
          )
        )
      )
    ){


      $rep = $cfg['repository'];
      $path = $this->decipher_path($rep['bbn_path'] . '/' . $rep['path']);
      if ( $ope === 'rename' ){
        $cfg['new_path'] = $cfg['path'];
      }
       // Normal file|folder
      if ( empty($cfg['is_mvc']) &&
        ( empty($cfg['is_file']) ||
          ( !empty($cfg['is_file']) &&
            !empty($rep['extensions'])
          )
        )
      ){
        $f = $this->check_normal($cfg, $rep, $path);

        if ( $ope === 'move' && !empty($cfg['is_file']) ){
          $f['new'] = $f['new']. '.'.$cfg['ext'];
        }
        if ( $f &&
          // Copy
          ((($ope === 'copy') &&
              \bbn\file\dir::copy($f['old'], $f['new'])
            ) ||
            // Rename
            (($ope === 'rename') &&
              \bbn\file\dir::move($f['old'], $f['new'])
            ) ||
            //Move
            (($ope === 'move') &&
              \bbn\file\dir::move($f['old'], $f['new'])
            ) ||
            // Delete
            (($ope === 'delete') &&
              \bbn\file\dir::delete($f['old'])
              /** @todo Remove backups */
            )
          )
        ){//for rename and move backup
          $this->operations_backup($f, $cfg, $ope);
          return true;
        }
      }
      // MVC
      else if ( !empty($rep['tabs']) ){

        if ( $todo = $this->check_mvc($cfg, $rep, $path) ){
          //die(\bbn\x::hdump($todo));
          foreach ( $todo as $t ){

            // Rename
            if ( ($ope === 'rename') || ($ope === 'move') ){

              if ( !\bbn\file\dir::move($t['old'], $t['new']) ){
                $this->error("Error during the file|folder move: old -> $t[old] , new -> $t[new]");
                return false;
              }


              if ( !empty($cfg['is_file']) ){
                // Remove file's options
                $this->options->remove(
                  $this->options->from_code(
                    $this->real_to_id($t['old']),
                    $this->_files_pref()
                  )
                );
              }
              else {
                // Remove folder's options
                $this->rem_dir_opt($t['old']);
              }

              // Change permissions
              if ( $ope === 'rename' ){
                if ( !empty($t['perms']) && !$this->change_perm_by_real($t['old'], $t['new'], empty($cfg['is_file']) ? 'dir' : 'file') ){
                  $this->error("Error during the file|folder permissions change: old -> $t[old] , new -> $t[new]");
                  return false;
                }
              }
              else{
                if ( !empty($t['perms']) && !$this->move_perm_by_real($t['old'], $t['new'], empty($cfg['is_file']) ? 'dir' : 'file') ){
                  $this->error("Error during the file|folder permissions change: old -> $t[old] , new -> $t[new]");
                  return false;
                }
              }


              $this->operations_backup($t, $cfg, $ope);
            }
            // Copy
            else if ( $ope === 'copy' ){

              if ( !is_dir(dirname($t['new'])) && !\bbn\file\dir::create_path(dirname($t['new'])) ){
                $this->error("Error during the folder creation: $t[new]");
                return false;
              }
              if ( !\bbn\file\dir::copy($t['old'], $t['new']) ){
                $this->error("Error during the file|folder copy: old -> $t[old] , new -> $t[new]");
                return false;
              }
              // Create permissions
              if ( !empty($t['perms']) && !$this->create_perm_by_real($t['new'], empty($cfg['is_file']) ? 'dir' : 'file') ){
                $this->error("Error during the file|folder permissions create: $t[new]");
                return false;
              }
            }
            // Delete
            else if ( $ope === 'delete' ){

              if ( !\bbn\file\dir::delete($t['old']) ){
                $this->error("Error during the file|folder delete: $t[old]");
                return false;
              }

              // Delete permissions
              if ( !empty($t['perms']) ){
                $this->delete_perm($t['old']);
              }
              /** @todo Remove backups */
            }
          }
          return true;
        }
      }
    }

    $this->error("Impossible to $ope the file|folder.");
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
  public function __construct(\bbn\appui\options $options, $routes, \bbn\user\preferences $pref){
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
      if ( \defined($a['bbn_path']) ){
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
        (\strlen($i) > \strlen($repository) )
      ){
        $repository = $i;
      }
    }
    if ( !empty($repository) ){
      return empty($obj) ? $repository : $repositories[$repository];
    }
    return false;
  }

  /***
   * Returns the filename and relative path from an URL
   *
   * @param string $url
   * @return bool|string
   */
  /*public function file_from_url(string $url){
    $rep = $this->repository_from_url($url);
    if ( $this->is_MVC($rep) ){
      $last = basename($url);
      if ( $repo = $this->repository($rep) ){
        $path = $this->get_root_path($rep).substr($url, \strlen($rep));
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
    return substr($url, \strlen($rep));
  }*/



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
    $st = \bbn\str::parse_path($st);
    $bits = explode('/', $st);
    /** @var string $constant The first path of the path which might be a constant */
    $constant = $bits[0];
    /** @var string $path The path that will be returned */
    $path = '';
    if ( \defined($constant) ){
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
    if ( \is_string($repository) ){
      $repository = $this->repository($repository);
    }
    if ( !empty($repository) && !empty($repository['bbn_path']) ){
      $repository_path = !empty($repository['path']) ? '/' . $repository['path'] : '';
      $path = $this->decipher_path(\bbn\str::parse_path($repository['bbn_path'] . $repository_path)) . '/';
      return \bbn\str::parse_path($path);
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
        'ssctrl' => $real['ssctrl'] ?? 0,
        'extension' => \bbn\str::file_ext(self::$current_file),
        'permissions' => false,
        'selections' => false,
        'line' => false,
        'char' => false,
        'marks' => false,
      ];
      if ( is_file(self::$current_file) ){
        $f['value'] = file_get_contents(self::$current_file);
        if ( $permissions = $this->get_file_permissions() ){
          $f = array_merge($f, $permissions);
        }
        /*if ( $preferences = $this->get_file_preferences() ){
          $f = array_merge($f, $preferences);
        }*/


        if ( $id_opt = $this->option_id() ){
          $val_opt =   $this->options->option($id_opt);
        }

        if( !empty($val_opt) ){
          $arr = [
              'selections' => $val_opt['selections'] ?: [],
              'marks' => $val_opt['marks'] ?: [],
              'line' => $val_opt['line'] ?:[],
              'char' => $val_opt['char'] ?:[],
            ];

          $f = array_merge($f, $arr);
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
      //if in the case of a rescue of _ctrl
      if ( $file['tab'] === "_ctrl" ){
        $backup_path = self::BACKUP_PATH . $file['repository'] . $file['path'] . $file['tab'] . '/';
        if ( is_numeric($file['ssctrl'])  && $file['ssctrl'] === 0){
          $backup_path = self::BACKUP_PATH . $file['repository'] . $file['tab'] . '/';
          //$backup_path =   $file['tab'] . '/';

        }else{
          $backup_path = self::BACKUP_PATH . $file['repository'] . $file['path'] . $file['tab'] . '/';
        }
      }
      else {
        $backup_path = self::BACKUP_PATH . $file['repository'] . $file['path'] . '/' . $file['filename'] . '/__end__/' . ($file['tab'] ?: $file['extension']) . '/';
      }

      // Delete the file if code is empty and if it isn't a super controller
      if ( empty($file['code']) && ($file['tab'] !== '_ctrl') ){

        if ( @unlink(self::$current_file) ){

          // Remove permissions
          $this->delete_perm();
          // Delete preferences
          if ( $this->pref ){
            $this->delete_file_preferences();
          }
          if ( !empty(self::$current_id) ){

            // Remove file's preferences
            $this->options->remove($this->options->from_code(self::$current_id, $this->_files_pref()));
            // Remove ide backups
            \bbn\file\dir::delete($backup_path, 1);
          }
          return ['deleted' => true];
        }
      }

      if ( is_file(self::$current_file) ){
        $backup = $backup_path . date('Y-m-d_His') . '.' . $file['extension'];
          \bbn\file\dir::create_path(dirname($backup));
          \bbn\file\dir::copy(self::$current_file, $backup);
      }
      else if ( !is_dir(dirname(self::$current_file)) ){
        \bbn\file\dir::create_path(dirname(self::$current_file));
      }

      if ( !empty($file['tab']) && ($file['tab'] === 'php') && !is_file(self::$current_file) ){
        if ( !$this->create_perm_by_real($file['full_path']) ){
          return $this->error("Impossible to create the option");
        }
      }
      file_put_contents(self::$current_file, $file['code']);
    
      /*if ( $this->pref ){
        $this->set_file_preferences(md5($file['code']), $file);
      }*/

      if( !empty($file['selections']) ||
        !empty($file['marks']) ||
        !empty($file['line']) ||
        !empty($file['char'])
      ){
        if ( $id_opt = $this->option_id() ){
          $arr= [];
          if ( !empty($file['selections']) ){
            $arr['selections'] = $file['selections'];
          }
          if ( !empty($file['marks']) ){
            $arr['marks'] = $file['marks'];
          }
          if ( !empty($file['line']) ){
            $arr['line'] = $file['line'];
          }
          if ( !empty($file['char']) ){
            $arr['char'] = $file['char'];
          };
          $this->options->set_prop($id_opt, $arr);
        }
      }
      return ['success' => true];
    }
    return $this->error('Error: Save');
  }
  /*public function save(array $file){
    if ( $this->set_current_file($this->decipher_path($file['full_path'])) ){
     // die(var_dump($file['repository'] , $file['path'] , $file['filename'], $file['tab'] ));
      $backup_path = self::BACKUP_PATH . $file['repository'] . $file['path'] . '/' . $file['filename'] . '/__end__/' . ($file['tab'] ?: $file['extension']) . '/';
      // Delete the file if code is empty and if it isn't a super controller
      if ( empty($file['code']) && ($file['tab'] !== '_ctrl') ){
        if ( @unlink(self::$current_file) ){
          // Remove permissions
          $this->delete_perm();
          // Delete preferences
          if ( $this->pref ){
            $this->delete_file_preferences();
          }
          if ( !empty(self::$current_id) ){

            // Remove file's preferences
            $this->options->remove($this->options->from_code(self::$current_id, $this->_files_pref()));
            // Remove ide backups
            bbn\file\dir::delete($backup_path, 1);
          }
          return ['deleted' => true];
        }
      }
      if ( is_file(self::$current_file)  ){
        $backup = $backup_path . date('Y-m-d_His') . '.' . $file['extension'];
        bbn\file\dir::create_path(dirname($backup));
        bbn\file\dir::copy(self::$current_file, $backup);
      }
      else if ( !is_dir(dirname(self::$current_file)) ){
        bbn\file\dir::create_path(dirname(self::$current_file));
      }
      if ( !empty($file['tab']) && ($file['tab'] === 'php') && !is_file(self::$current_file) ){
        if ( !$this->create_perm_by_real($file['full_path']) ){
          return $this->error("Impossible to create the option");
        }
      }
      file_put_contents(self::$current_file, $file['code']);
      if ( $this->pref ){
        $this->set_file_preferences(md5($file['code']), $file);
      }
      return ['success' => true];
    }
    return $this->error('Error: Save');
  }*/

  /**
   * Creates a new file|directory
   *
   * @param array $cfg
   * @return bool
   */
  public function create(array $cfg){
    //die(var_dump(isset($cfg['extension'], $cfg['tab'], $cfg['tab_path'])));
    if ( !empty($cfg['repository']) &&
      !empty($cfg['repository']['bbn_path']) &&
      !empty($cfg['repository']['path']) &&
      !empty($cfg['name']) &&
      !empty($cfg['path']) &&
      isset($cfg['is_file'], $cfg['extension'], $cfg['tab'], $cfg['tab_path'])
    ){

      $rep = $cfg['repository'];
      $path = $this->decipher_path($rep['bbn_path'] . '/' . $rep['path']);
      if ( !empty($cfg['tab_path']) ){
        $path .= $cfg['tab_path'];
      }
      if ( $cfg['path'] !== './' ){
        $path .= $cfg['path'];
      }

      // New folder

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
      // New file
      else if ( !empty($cfg['is_file']) && !empty($cfg['extension']) ){
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

            $this->error("Impossible to create the file");
            return false;
          }
        }
        // Add item to options table for permissions
        if ( !empty($cfg['tab']) && ($cfg['tab'] === 'php') && !empty($file) ){
          if ( !$this->create_perm_by_real($file) ){
            return $this->error("Impossible to create the option");
          }
        }
      }
      return true;
    }
    return false;
  }

  /**
   * Copies a file or a folder.
   *
   * @param $cfg
   * @return bool
   */
  public function copy(array $cfg){
    return $this->operations($cfg, 'copy');
  }

  /**
   * Renames a file or a folder.
   *
   * @param $cfg
   * @return bool
   */
  public function rename(array $cfg){
    return $this->operations($cfg, 'rename');
  }

  /**
   * Moves a file or a folder.
   *
   * @param $cfg
   * @return bool
   */
  public function move(array $cfg){
    return $this->operations($cfg, 'move');
  }

  /**
   * Renames a file or a folder.
   *
   * @param $cfg
   * @return bool
   */
  public function delete(array $cfg){
    return $this->operations($cfg, 'delete');
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
   * Changes permissions to a file/dir from the old and new real file/dir's path
   *
   * @param string $old The old file/dir's path
   * @param string $new The new file/dir's path
   * @param string $type The type (file/dir)
   * @return bool
   */
  public function change_perm_by_real(string $old, string $new, string $type = 'file'){
    $type = strtolower($type);
    if ( !empty($old) &&
      !empty($new) &&
      file_exists($new) &&
      ($id_opt = $this->real_to_perm($old, $type)) &&
      !$this->real_to_perm($new, $type)
    ){
      $is_file = $type === 'file';
      $code = $is_file ? \bbn\str::file_ext(basename($new), 1)[0] : basename($new).'/';

      if ( $id_parent = $this->create_perm_by_real(dirname($new).'/', 'dir') ){

        $this->options->set_code($id_opt, $code);
        $this->options->move($id_opt, $id_parent);
        return true;
      }
    }
    return false;
  }

  /**
   * Moves permissions to a file/dir from the old and new real file/dir's path
   *
   * @param string $old The old file/dir's path
   * @param string $new The new file/dir's path
   * @param string $type The type (file/dir)
   * @return bool
   */
  public function move_perm_by_real(string $old, string $new, string $type = 'file'){
      $type = strtolower($type);
    if ( !empty($old) &&
      !empty($new) &&
      file_exists($new)
    ){

       $id_opt = $this->real_to_perm($old, $type);
       $id_new_opt = $this->real_to_perm($new, $type);
       if ( empty($id_new_opt) ){
         $id_new_opt = $this->create_perm_by_real(dirname($new).'/', 'dir');
       }
       if ( ($id_opt !== $id_new_opt) && !empty($id_new_opt) ){
          $is_file = $type === 'file';
          $code = $is_file ? \bbn\str::file_ext(basename($new), 1)[0] : basename($new).'/';
          if ( $id_parent = $this->create_perm_by_real(dirname($new).'/', 'dir') ){
             $this->options->set_code($id_opt, $code);
             $this->options->move($id_opt, $id_parent);
             return true;
          }
       }
     }
   return false;
  }


  /**
   * Creates a permission option from a real file/dir's path
   *
   * @param string $file The real file/dir's path
   * @param string $type The type of real (file/dir)
   * @return bool
   */
  public function create_perm_by_real(string $file, string $type = 'file'){
    if ( !empty($file) &&
      \defined('BBN_APP_PATH') &&
      // It must be a controller
      (strpos($file, '/mvc/public/') !== false)
    ){
      $is_file = $type === 'file';
      // Check if it's an external route
      foreach ( $this->routes as $i => $r ){
        if ( strpos($file, $r) === 0 ){
          // Remove route
          $f = substr($file, \strlen($r), \strlen($file));
          // Remove /mvc/public
          $f = substr($f, \strlen('/mvc/public'), \strlen($f));
          // Add the route's name to path
          $f = $i . '/' . $f;
        }
      }
      // Internal route
      if ( empty($f) ){
        $root_path = BBN_APP_PATH.'mvc/public/';
        if ( strpos($file, $root_path) === 0 ){
          // Remove root path
          $f = substr($file, \strlen($root_path), \strlen($file));
        }
      }
      if ( !empty($f) ){
        $bits = \bbn\x::remove_empty(explode('/', $f));
        $code = $is_file ? \bbn\str::file_ext(array_pop($bits), 1)[0] : array_pop($bits).'/';
        $id_parent = $this->options->from_code(self::BBN_PAGE, self::BBN_PERMISSIONS, self::BBN_APPUI);
        foreach ( $bits as $b ){
          if ( !$this->options->from_code($b.'/', $id_parent) ){
            $this->options->add([
              'id_parent' => $id_parent,
              'code' => $b.'/',
              'text' => $b
            ]);
          }
          $id_parent = $this->options->from_code($b.'/', $id_parent);
        }
        if ( !$this->options->from_code($code, $id_parent) ){
          $this->options->add([
            'id_parent' => $id_parent,
            'code' => $code,
            'text' => $code
          ]);
        }
        return $this->options->from_code($code, $id_parent);
      }
      else if ( !$is_file ){
        return $this->options->from_code(self::BBN_PAGE, self::BBN_PERMISSIONS, self::BBN_APPUI);
      }
      return true;
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
      $pref = $this->pref->get_all($id_option);
      return [
        'selections' => $pref[0]['selections'] ?: [],
        'marks' => $pref[0]['marks'] ?: [],
        'line' => $pref[0]['line'] ?:[],
        'char' => $pref[0]['char'] ?:[],
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
      if ( isset($cfg['line']) ){
        $c['line'] = $cfg['line'];
      }
      if ( isset($cfg['char']) ){
        $c['char'] = $cfg['char'];
      }
      if ( ($id_option = $this->option_id()) ){

      //  return true;
        $ele = $this->pref->get_all($id_option);
        if ( !empty($ele) ){
          if( $this->pref->update($ele[0]['id'], $c) ){
            return true;
          }
        }
        else{
          if( $this->pref->add($id_option, $c) ){
            return true;
          }
        }
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
   * @param string $type The path type (file or dir)
   * @return bool|int
   */
  public function real_to_perm(string $file, $type = 'file'){
    if ( empty($file) ){
      $file = self::$current_file;
    }
    if ( !empty($file) &&
      \defined('BBN_APP_PATH') &&
      // It must be a controller
      (strpos($file, '/mvc/public/') !== false)
    ){

      $is_file = $type === 'file';
      // Check if it's an external route
      foreach ( $this->routes as $i => $r ){
        if ( strpos($file, $r) === 0 ){
         // Remove route
          $f = substr($file, \strlen($r), \strlen($file));
          // Remove /mvc/public
          $f = substr($f, \strlen('/mvc/public'), \strlen($f));
          // Add the route's name to path
          $f = $i . '/' . $f;
          break;
        }
      }
      // Internal route
      if ( empty($f) ){
        $root_path = BBN_APP_PATH.'mvc/public/';

        if ( strpos($file, $root_path) === 0 ){
          // Remove root path
          $f = substr($file, \strlen($root_path), \strlen($file));

        }
      }
      if ( !empty($f) ){

        $bits = \bbn\x::remove_empty(explode('/', $f));
        $code = $is_file ? \bbn\str::file_ext(array_pop($bits), 1)[0] : array_pop($bits).'/';
        $bits = array_map(function($b){
          return $b.'/';
        }, array_reverse($bits));
        array_unshift($bits, $code);
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
        $bits = explode('/', substr($file, \strlen($root)));
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
   * Returns the file's ID from the real file's path.
   *
   * @param string $file The real file's path
   * @return bool|string
   */
  public function real_to_id($file){
    if ( ($rep = $this->repository_from_url($this->real_to_url($file), true)) && \defined($rep['bbn_path']) ){
      $bbn_p = constant($rep['bbn_path']);
      if ( strpos($file, $bbn_p) === 0 ){
        $f = substr($file, \strlen($bbn_p));
        return \bbn\str::parse_path($rep['bbn_path'].'/'.$f);
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
      $bits = explode('/', substr($url, \strlen($rep['bbn_path'].$rep['path'])+1));
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
              $o['ssctrl'] = $ssc['ssctrl'];
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
        $res = \bbn\str::parse_path($res);
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
   * Returns all backups of a file.
   *
   * @param string $url The file's URL
   * @param bool $all Tparameter that allows you to have all the code if it is set to true
   * @return array|bool
   */
  public function history(string $url, bool $all = false){
    $check_ctrl = false;
    $copy_url = explode("/", $url);
    $backups = [];
    $history_ctrl = [];

    // File's backup path
    $path = self::BACKUP_PATH . $url;
    if ( !empty($url) && !empty(self::BACKUP_PATH) ){
      $ctrl_path = explode("/", $path);
      for($y=0; $y <2; $y++){
        array_pop($ctrl_path);
      }

      //check if there is "_ctrl" in the url as the last step of the "$url"; in that case we tart $url to give the right path to get it to take its own backup files.
      if ( end($copy_url) === "_ctrl" ){
        $url = explode("/", $url);
        array_pop($url);
        $url = implode("/", $url);
        $check_ctrl_files = true;
        $copy_url = explode("/", $url);
        for($y=0; $y <2; $y++){
          array_pop($copy_url);
        }
        $copy_url = implode("/", $copy_url)."/"."_ctrl";

      }



      //First, check the presence of _ctrl backups.
      $ctrl_path = implode("/", $ctrl_path)."/"."_ctrl";

      // read _ctrl if exsist

       if ( is_dir($ctrl_path)  ){
           //If there is a "_ctrl" backup, insert it into the array that will be merged with the remaining backup at the end of the function.
           if ( $files_ctrl = \bbn\file\dir::get_files($ctrl_path) ){

             $mode = basename($ctrl_path);

             $history_ctrl = [
               'text' => basename($ctrl_path),
               'icon' => 'folder-icon',
               'folder' => true,
               'items' => [],
               'num_items' => \count(\bbn\file\dir::get_files($files_ctrl))
             ];
             //If we are requesting all files with their contents, this block returns to the "_ctrl" block.
             if( $all===true ){

             foreach ( $files_ctrl as $file ){
               $filename = \bbn\str::file_ext($file, true)[0];
               $file_name = $filename;
               $moment = strtotime(str_replace('_', ' ', $filename));
               $date = date('d/m/Y', $moment);
               $time = date('H:i:s', $moment);

               if ( ($i = \bbn\x::find($history_ctrl['items'], ['text' => $date])) === false ){
                 array_push($history_ctrl['items'], [
                   'text' => $date,
                   'items'=> [],
                   'folder' => true,
                   'icon' => 'folder-icon'
                 ]);

                 $i = \count($history_ctrl['items']) - 1;
                 if ( ($idx = \bbn\x::find($history_ctrl['items'][$i]['items'], ['text' => $time])) === false ){
                   array_push($history_ctrl['items'][$i]['items'], [
                     'text' => $time,
                     'mode' => basename($ctrl_path),
                     'file' => $file_name,
                     'ext' => \bbn\str::file_ext($file, true)[1],
                     'path' => $url,
                     'folder' => false
                   ]);
                 }
               } else {
                 $j = \bbn\x::find($history_ctrl['items'], ['text' => $date]);
                 if ( ($idx = \bbn\x::find($history_ctrl['items'][$j]['items'], ['text' => $time])) === false ){
                   array_push($history_ctrl['items'][$j]['items'], [
                     'text' => $time,
                     'code' => file_get_contents($file),
                     'folder' => false,
                     'mode' => basename($ctrl_path),
                     'folder' => false
                   ]);
                 }
               }
             }
           }
           //otherwise pass some useful parameters to get information with other posts see block in case of "$all" to false.
           else{
             $check_ctrl = true;
           }
         }
       }
       //taken or not the backup of the "_ctrl" we move on to acquire the date of the project, if set to true then as done before, we will take into consideration all the date including the contents of the files.
      if( $all === true ){

        if ( is_dir($path) ){
          //if we pass a path that contains all the backups
          if ( $dirs = \bbn\file\dir::get_dirs($path) ){
            if ( !empty($dirs) ){
              $mode = basename($path) === "_ctrl" || basename($path) === "model" ? "php" : basename($path);
              foreach ( $dirs as $dir ){
                if ( $files = \bbn\file\dir::get_files($dir) ){
                  foreach ( $files as $file ){
                    $filename = \bbn\str::file_ext($file, true)[0];
                    $moment = strtotime(str_replace('_', ' ', $filename));
                    $date = date('d/m/Y', $moment);
                    $time = date('H:i:s', $moment);
                    if ( ($i = \bbn\x::find($backups, ['text' => $date])) === false ){
                      array_push($backups, [
                        'text' => $date,
                        'folder' => true,
                        'items' => [],
                        'icon' => 'folder-icon'
                      ]);
                      $i = \count($backups) - 1;
                    }
                    if ( ($idx = \bbn\x::find($backups[$i]['items'], ['title' => $d])) === false ){
                      array_push($backups[$i]['items'], [
                        'text' => $d,
                        'folder' => true,
                        'items' => [],
                        'icon' => 'folder-icon'
                      ]);
                      $idx = \count($backups[$i]['items']) - 1;
                    }
                    array_push($backups[$i]['items'][$idx]['items'], [
                      'text' => $time,
                      'mode' => $mode,
                      'code' => file_get_contents($file),
                      'folder' => false
                    ]);
                  }
                }
              }
            }
          }
          //If we pass a path that contains the specific backups of a type and is set to "$all" to true then all backups of this type will return.
          else {
            if ( $files = \bbn\file\dir::get_files($path) ){
              if ( !empty($files) ){
                $mode = basename($path) === "_ctrl" || basename($path) === "model" ? "php" : basename($path);
                foreach ( $files as $file ){

                  $filename = \bbn\str::file_ext($file, true)[0];
                  $file_name = $filename;
                  $moment = strtotime(str_replace('_', ' ', $filename));
                  $date = date('d/m/Y', $moment);
                  $time = date('H:i:s', $moment);

                  if ( ($i = \bbn\x::find($backups, ['text' => $date])) === false ){
                    array_push($backups, [
                      'text' => $date,
                      'folder' => true,
                      'items' => [],
                      'icon' => 'folder-icon'
                    ]);

                    $i = \count($backups) - 1;
                    if ( ($idx = \bbn\x::find($backups[$i]['items'], ['text' => $time])) === false ){
                      array_push($backups[$i]['items'], [
                        'text' => $time,
                        'mode' => $mode,
                        'code' => file_get_contents($file),
                        'folder' => false
                      ]);
                    }
                  } else {
                    $j = \bbn\x::find($backups, ['text' => $date]);
                    if ( ($idx = \bbn\x::find($backups[$j]['items'], ['text' => $time])) === false ){
                      array_push($backups[$j]['items'], [
                        'text' => $time,
                        'mode' => $mode,
                        'code' => file_get_contents($file),
                        'folder' => false
                      ]);
                    }
                  }
                }
              }
            }
          }
        }
      }//otherwise returns the useful information for processing and to make any subsequent postings.
      else{
        //if we want you to return all the backup information useful to process and make other posts
        $listDir = \bbn\file\dir::get_dirs($path);
        if ( !empty($listDir) && !isset($check_ctrl_files) ){

          foreach ( $listDir as $val ){
            array_push($backups, [
              'text' => basename($val),
              'icon' => 'folder-icon',
              'folder' => true,
              'num_items' => \count(\bbn\file\dir::get_files($val))
            ]);
          }
          //If the _ctrl backup folder exists, then it will be added to the list.
          if( $check_ctrl === true ){
            array_push($backups, $history_ctrl);
          }
        }//If we pass a path that contains the specific backups of a type and is not set "$all" then the backup of with useful information for any other posts returns.
        else{
          //If we are requesting ctrl backup files then we give it the right path and "$check_ctrl_files" is a variable that makes us understand whether or not we ask for backup files of "_ctrl".
          if ( $check_ctrl_files === true  ){
            $url= $copy_url;
            $path = self::BACKUP_PATH . $url;
          }
          //die(\bbn\x::hdump($files, $copy_url, $path));
          if ( $files = \bbn\file\dir::get_files($path) ){

            if ( !empty($files) ){
              $mode = basename($path) === "_ctrl" || basename($path) === "model" ? "php" : basename($path);
              foreach ( $files as $file ){
                $filename = \bbn\str::file_ext($file, true)[0];
                $file_name = $filename;
                $moment = strtotime(str_replace('_', ' ', $filename));
                $date = date('d/m/Y', $moment);
                $time = date('H:i:s', $moment);

                if ( ($i = \bbn\x::find($backups, ['text' => $date])) === false ){
                  array_push($backups, [
                    'text' => $date,
                    'folder' => true,
                    'items' => [],
                    'icon' => 'folder-icon'
                  ]);

                  $i = \count($backups) - 1;
                  if ( ($idx = \bbn\x::find($backups[$i]['items'], ['text' => $time])) === false ){
                    array_push($backups[$i]['items'], [
                      'text' => $time,
                      'mode' => $mode,
                      'file' => $file_name,
                      'ext' => \bbn\str::file_ext($file, true)[1],
                      'path' => $url,
                      'folder' => false
                    ]);
                  }
                } else {
                  $j = \bbn\x::find($backups, ['text' => $date]);
                  if ( ($idx = \bbn\x::find($backups[$j]['items'], ['text' => $time])) === false ){
                    array_push($backups[$j]['items'], [
                      'text' => $time,
                      'mode' => $mode,
                      'file' => $file_name,
                      'ext' => \bbn\str::file_ext($file, true)[1],
                      'path' => $url,
                      'folder' => false
                    ]);
                  }
                }
              }
            }
          }
        }
      }
    }
    //If you add the "_ctrl " backup, enter it to the rest of the date.
    if( !empty($history_ctrl) && !empty($backups) && $all === true && $check_ctrl === false  ){
      array_push($backups, $history_ctrl);
    }//if you have only the backups of the super _ctrl and no other, it has been differentiated because of different paths
    else if( !empty($history_ctrl) && empty($backups) && $check_ctrl === true  ){
      array_push($backups, $history_ctrl);
    }
    return $backups;
  }

  /*public function history(string $url){
    if ( !empty($url) && !empty(self::BACKUP_PATH) ){
      $backups = [];
      // File's backup path
      $path = self::BACKUP_PATH . $url;
      if ( is_dir($path) && ($dirs = \bbn\file\dir::get_dirs($path)) ){
        foreach ( $dirs as $dir ){
          if ( $files = \bbn\file\dir::get_files($dir) ){
            $d = basename($dir);
            foreach ( $files as $file ){
              $filename = \bbn\str::file_ext($file, true)[0];
              $moment = strtotime(str_replace('_', ' ', $filename));
              $date = date('d/m/Y', $moment);
              $time = date('H:i:s', $moment);
              if ( ($i = \bbn\x::find($backups, ['title' => $date])) === false ){
                array_push($backups, [
                  'title' => $date,
                  'folder' => true,
                  'lazy' => true,
                  'children' => [],
                  'icon' => 'folder-icon'
                ]);
                $i = \count($backups) - 1;
              }
              if ( ($idx = \bbn\x::find($backups[$i]['children'], ['title' => $d])) === false ){
                array_push($backups[$i]['children'], [
                  'title' => $d,
                  'folder' => true,
                  'lazy' => true,
                  'children' => [],
                  'icon' => 'folder-icon'
                ]);
                $idx = \count($backups[$i]['children']) - 1;
              }
              array_push($backups[$i]['children'][$idx]['children'], [
                'title' => $time,
                'mode' => $d,
                'code' => file_get_contents($file),
                'folder' => false
              ]);
            }
          }
        }
      }
      return $backups;
    }
  }*/


}
