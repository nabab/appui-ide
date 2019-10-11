<?php
/**
 * Created by BBN Solutions.
 * User: Mirko Argentino
 * Date: 04/02/2017
 * Time: 15:56
 */
namespace appui;

class ide {

  use \bbn\models\tts\optional;

  const BBN_APPUI = 'appui',
        BBN_PERMISSIONS = 'permissions',
        BBN_PAGE = 'page',
        IDE_PATH = 'ide',
        DEV_PATH = 'PATHS',
        PATH_TYPE = 'PTYPES',
        FILES_PREF = 'files',
        OPENED_FILE = 'opened',
        RECENT_FILE = 'recent';

  public static $backup_path;

  private static
    /** @var bool|int $ide_path */
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
    /** @var \bbn\db $db */
    $db,
    /** @var \bbn\appui\options $options */
    $options,
    /** @var null|string The last error recorded by the class */
    $last_error,
    /** @var array MVC routes for linking with repositories */
    $routes = [],
    /** @var \bbn\user\preferences $pref */
    $pref,
    /** @var \bbn\appui\project $projects */
    $projects;

  /**
   * Gets the ID of the development paths option
   *
   * @return int
   */
  private function _ide_path(){
    self::optional_init();
    if ( !self::$ide_path ){
      self::_init_ide();
    }
    return self::$ide_path;
  }

  /**
   * Sets the root of the development paths option
   *
   * @param $id
   */
  private static function _init_ide(){
    self::$ide_path = self::$option_root_id;
    self::$backup_path = \bbn\mvc::get_data_path('appui-ide').'backup/';
  }

  /**
   * Gets the ID of the development paths option
   *
   * @return int
   */
  private function _dev_path(){
    if ( !self::$dev_path ){
      if ( $id = self::get_option_id(self::DEV_PATH) ){
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
      if ( $id = self::get_option_id(self::FILES_PREF)){
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
   * Function that returns corresponding bit with option id
   *
   * @param string $id_option option linked to the bit
   * @param string $id_user if set user id will return the result for that user otherwise the current one will return
   * @return array|null
   */
  private function get_bit_by_option(string $id_option, string $id_user = null): ?array
  {
    if ( \bbn\str::is_uid($id_option) &&
      !empty($this->db) &&
      !empty($this->pref) &&
      !empty($pref_arch = $this->pref->get_class_cfg())
    ){
      if ( is_null($id_user) ){
        $id_user = $this->pref->id_user;
      }
      return  $this->db->rselect([
        'table' => $pref_arch['tables']['user_options_bits'],
        'fields' => [],
        'where' => [
          'conditions' => [[
            'field' => $pref_arch['arch']['user_options_bits']['id_option'],
            'value' => $id_option
          ],[
            'field' => $pref_arch['arch']['user_options_bits']['id_user_option'],
            'value' => $id_user
          ]]
        ]
      ]);
    }
    return null;
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
        $repository = $this->repository_from_url($url, true);

        if ( !empty($repository) && \defined($repository['bbn_path']) ){
          $bbn_path = $repository['bbn_path'];
        }
      }
      /*if ( !empty($bbn_path) && \defined($bbn_path) ){
        $bbn_path = $bbn_path === 'BBN_APP_PATH' ? \bbn\mvc::get_app_path() : constant($bbn_path); 
        if ( strpos($file, $bbn_path) === 0 ){
          self::$current_id = str_replace($bbn_path, $bbn_path.'/', $file);
        }
      }*/
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
      else{
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
      if ( !empty($rep['alias_code']) && ($rep['alias_code'] === 'bbn-project') ){
        $path .= 'mvc/';
      }
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
        if ( ($tab['url'] !== '_ctrl') && !empty($tab['extensions']) ){
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
              'perms' =>  $tab['url'] === 'php' //$i === 'php'
            ]);
          }
        }
      }
    }
    return $todo;
  }


  /**
   * Get list files preferences of the repository
   *
   * @param string $id_rep
   * @param string $get_id
   *
   * @return array|null
   */
  private function get_list_preferences(string $id_rep, $get_id = false): ?array 
  {
    if ( \bbn\str::is_uid($id_rep) && count($preferences = $this->options->full_options_by_id($id_rep)) > 0 ){
      $list = [];
      foreach( $preferences as $file ){
        if ( !empty($file['id']) &&
          !empty($file['code'])
        ){
          if ( $get_id ){
            $list[] = [
              'code' => $file['code'],
              'id' => $file['id']
            ];
          }
          else{
            $list[]= $file['code'];
          }
        }
      }
      return $list;
    }
    return null;
  }

  /**
   * Delete the bits that all have the same id_option
   *
   * @param [type] $id_option
   * @return boolean|null
   */
  private function delete_bits_preferences(string $id_option): ?bool
  {
    if ( \bbn\str::is_uid($id_option) && !empty($bits = $this->pref->get_bits_by_id_option($id_option)) ){
      $delete_bits = true;
      foreach ( $bits as $bit ){
        if ( is_null($this->pref->delete_bit($bit['id'])) ){
          $delete_bits = false;
          break;
        }
      }
      return $delete_bits;
    }
    return null;
  }

  /**
   * Delete a component vue or all folder
   *
   * @param array $cfg component info
   * @return bool
   */
  private function delete_component(array $cfg){
    if( !empty($cfg) && !empty($cfg['repository']) ){
      $rep = $cfg['repository'];
      $path = $this->decipher_path($rep['bbn_path'] . '/' . $rep['path']);
      if ( !empty($cfg['path']) && !empty($cfg['is_file']) ){
        if ( empty(\bbn\file\dir::delete($path.$cfg['path'])) ){
          return false;
        }
        return true;
      }
      //case of context menu
      else{
        $folder = !empty($cfg['is_file']) ? false : true;
        $ctrl_error = false;
        if ( !empty($rep['bbn_path']) && !empty($rep['path']) && !empty($cfg['path']) && !empty($cfg['name']) ){
          //all
          if ( empty($cfg['only_component']) ){
            $component = $path.$cfg['path'].$cfg['name'];
            if ( empty(\bbn\file\dir::delete($component)) ){
              return false;
            }
            else{
              //delete Preferences
              $this->delete_file_preferences($component, $rep, $folder);
              $this->operations_backup_components($cfg, "delete");
            }
            return true;
          }
          else{
            if ( !empty($rep['tabs']) && is_array($rep['tabs']) ){
              foreach( $rep['tabs'] as $ele ){
                if ( empty($ctrl_error) ){
                  if ( is_array($ele['extensions']) ){
                    foreach($ele['extensions'] as $a){
                      $component = $path.$cfg['path'].$cfg['name'].'/'.$cfg['name'].'.'.$a['ext'];
                      if( !empty(file_exists($component)) ){
                        if ( empty(\bbn\file\dir::delete($component)) ){
                          $ctrl_error = true;
                          break;
                        }
                        else{
                          //delete Preferences
                          $this->delete_file_preferences($component, $rep, $folder);
                          $this->operations_backup_components($cfg, "delete");
                        }
                      }
                    }
                  }
                }
                else{
                  return false;
                }
              }
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  /**
   * Copy a component vue or all folder
   *
   * @param array $cfg component info
   * @return bool
   */
  private function copy_component(array $cfg){
    if ( !empty($cfg) &&
      !empty($cfg['path']) &&
      !empty($cfg['new_path']) &&
      !empty($cfg['name']) &&
      !empty($cfg['new_name']) &&
      !empty($cfg['repository'])
    ){
      $ctrl_error = false;
      $rep = $cfg['repository'];
      if( !empty($rep['bbn_path']) && !empty($rep['path']) ){
        $path = $this->decipher_path($rep['bbn_path'] . '/' . $rep['path']);
        $old_folder_component = $path.$cfg['path'].$cfg['name'];
        $new_folder_component = $path.$cfg['new_path'].$cfg['new_name'];
        //copy only component
        if ( !empty($cfg['only_component']) ){
          if( \bbn\file\dir::create_path($new_folder_component) ){
            if ( !empty($rep['tabs']) && is_array($rep['tabs']) ){
              foreach( $rep['tabs'] as $ele ){
                if ( empty($ctrl_error) ){
                  if ( !empty($ele['extensions']) && is_array($ele['extensions']) ){
                    foreach($ele['extensions'] as $a){
                      $old_component = $old_folder_component.'/'.$cfg['name'].'.'.$a['ext'];
                      $new_component = $new_folder_component.'/'.$cfg['new_name'].'.'.$a['ext'];
                      if( !empty(file_exists($old_component)) && empty(file_exists($new_component)) ){
                        if ( empty(\bbn\file\dir::copy($old_component, $new_component)) ){
                          $ctrl_error = true;
                          break;
                        }
                      }
                    }
                  }
                }
                else{
                  $this->error("Error during the copy of component");
                  return false;
                }
              }
            }
          }
        }
        else{
          if ( empty(\bbn\file\dir::copy($old_folder_component, $new_folder_component)) ){
            //case error
            $ctrl_error = true;
          }
          if( empty($ctrl_error) &&
              empty($cfg['is_file']) &&
              !empty($cfg['component_vue'])
          ){
            if ( !empty($rep['tabs']) && is_array($rep['tabs']) ){
              foreach( $rep['tabs'] as $ele ){
                if ( empty($ctrl_error) ){
                  if ( !empty($ele['extensions']) && is_array($ele['extensions']) ){
                    foreach($ele['extensions'] as $a){
                      $old_component = $new_folder_component.'/'.$cfg['name'].'.'.$a['ext'];
                      $new_component = $new_folder_component.'/'.$cfg['new_name'].'.'.$a['ext'];
                      if( !empty(file_exists($old_component)) && empty(file_exists($new_component)) ){
                        if ( empty(\bbn\file\dir::move($old_component, $new_component)) ){
                          $ctrl_error = true;
                          break;
                        }
                      }
                    }
                  }
                }
                else{
                  $this->error("Error during the copy component");
                  return false;
                }
              }
            }
          }
        }
      }
    }
    return false;
  }


  /**
   * Rename a component vue or all folder
   *
   * @param array $cfg component info
   * @return bool
   */
  private function rename_component(array $cfg){

    if ( !empty($cfg) &&
      !empty($cfg['path']) &&
      !empty($cfg['new_path']) &&
      !empty($cfg['name']) &&
      !empty($cfg['new_name']) &&
      !empty($cfg['repository'])
    ){

      $rep = $cfg['repository'];
      if( !empty($rep['bbn_path']) && !empty($rep['path']) ){
        $path = $this->decipher_path($rep['bbn_path'] . '/' . $rep['path']);
        $ctrl_error = false;
        $old_folder_component = $path.$cfg['path'].$cfg['name'];
        $new_folder_component = $path.$cfg['path'].$cfg['new_name'];
        //folder
        if ( empty($cfg['only_component']) ){
          if ( empty($cfg['component_vue']) ){
            $this->rename_file_preferences($new_folder_component, $old_folder_component, $cfg['repository'], true);
          }
          if ( empty(\bbn\file\dir::move($old_folder_component, $new_folder_component)) ){
            $ctrl_error = true;
            $this->error("Error during the rename component");
          }
          else{
            $this->operations_backup_components($cfg, "rename");
          }
        }
        else{
          if ( empty(is_dir($new_folder_component)) &&
            empty(\bbn\file\dir::create_path($new_folder_component))
          ){
            $ctrl_error = true;
          }
          else{
            $this->operations_backup_components($cfg, "rename");
          }
        }

        if( empty($ctrl_error) && empty($cfg['is_file']) && !empty($cfg['component_vue'])){
          if ( !empty($rep['tabs']) && is_array($rep['tabs']) ){
            foreach( $rep['tabs'] as $ele ){
              if ( empty($ctrl_error) ){
                if ( !empty($ele['extensions']) && is_array($ele['extensions']) ){
                  foreach($ele['extensions'] as $a){
                    //for rename component preferences
                    $old_component_pref = $old_folder_component.'/'.$cfg['name'].'.'.$a['ext'];
                    $new_component_pref = $new_folder_component.'/'.$cfg['new_name'].'.'.$a['ext'];
                    $this->rename_file_preferences($new_component_pref, $old_component_pref, $cfg['repository']);
                    $old_component = (empty($cfg['only_component']) ? $new_folder_component : $old_folder_component) .'/'.$cfg['name'].'.'.$a['ext'];
                    $new_component = $new_folder_component.'/'.$cfg['new_name'].'.'.$a['ext'];
                    if( !empty(file_exists($old_component)) && empty(file_exists($new_component)) ){
                      if ( !empty($cfg['only_component']) ){
                        if ( empty(\bbn\file\dir::move($old_component, $new_component)) ){
                          $ctrl_error = true;
                          $this->error("Error during the rename component");
                          return false;
                        }
                        else{
                          $this->operations_backup_components($cfg, "rename");
                        }
                      }
                      else{
                        if ( empty(rename($old_component, $new_component)) ){
                          $ctrl_error = true;
                          $this->error("Error during the rename component");
                          return false;
                        }
                        else{
                          $this->operations_backup_components($cfg, "rename");
                        }
                      }
                    }
                  }
                }
              }
              else{
                break;
              }
            }
          }
        }
        if( !empty($ctrl_error) ){
          $this->error("Impossible to the file|folder.");
          return false;
        }
        else{
          return true;
        }
      }
    }
    return false;
  }


  /**
   * Renames|movie a file or a folder of the backup.
   *
   * @param array $cfg The components info
   * @param string $ope The operation type (rename, copy)
   * @return bool
   */
  private function operations_backup_components(array $cfg, string $case ){
    if ( !empty($cfg['is_component']) ){
      $backup_path = self::$backup_path . $cfg['repository']['bbn_path'] .'/'.($cfg['repository']['path'] === '/' ? '' : $cfg['repository']['path']);
      if ( !empty($cfg['is_vue']) ){
        $old_path_component = $backup_path.$cfg['path'].$cfg['name'].'/'.$cfg['name'];
        if ( ($case === "move") || ($case === "rename") ){
          $new_path_component = $backup_path.$cfg['new_path'].'/'.$cfg['new_name'].'/'.$cfg['new_name']."/__end__";
          if ( is_dir($old_path_component) ){
            if ( ($case === 'move') || ($case === 'rename') ){
              if ( !\bbn\file\dir::move($old_path_component, $new_path_component, false) ){
                $this->error("Error during the component backup move||rename: old -> $old_path_component , new -> $new_path_backup");
              }
            }

          }
        }
        else if ( $case === 'delete' ){
          if ( !\bbn\file\dir::delete($old_path_component) ){
            $this->error("Error during the component backup delete: old -> $old_path_component");
          }
        }
      }
      else{
        if ( ($case === 'move') || ($case === 'rename') ){
          $old_folder_component = $backup_path.$cfg['path'].$cfg['name'];
          $new_folder_component = $backup_path.$cfg['new_path'].$cfg['new_name'];
          if ( !\bbn\file\dir::move($old_folder_component, $new_folder_component, false) ){
            $this->error("Error during the folder backup move||rename: old -> $old_path_component , new -> $new_path_backup");
          }
        }
      }
    }
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
    $backup_path = self::$backup_path . $cfg['repository']['bbn_path'].
     ($cfg['repository']['path'] === '/' ? '' : '/'.$cfg['repository']['path']);

    if ( !empty($cfg['repository']['bbn_path']) &&
         !empty($path['old']) &&
         !empty($cfg['path']) &&
         !empty($path['old'])
    ){
      $old_backup = $backup_path.($cfg['is_project'] && $cfg['type'] ? '/'.$cfg['type'] .'/' : '/');

      $path_old =  explode("/", $path['old']);
      if ( is_array($path_old) && count($path_old) ){
        $path_old = array_pop($path_old);
        $path_old = explode(".",$path_old)[0];
         $old_backup .= $cfg['path'] . $path_old;
      }
      else{
        $this->error("Error during the file|folder backup delete: old -> $old_backup");
      }
      //CASE MOVE and RENAME
      if ( (($case === 'move') || ($case === 'rename')) &&
        !empty($path['new'])
      ){
        $new_backup = $backup_path.'/'.($cfg['is_project'] && $cfg['type'] ? $cfg['type'] .'/' : '');
        $new_backup .= ($case === 'rename' ? $cfg['path'] : $cfg['new_path'].'/').\bbn\str::file_ext($path['new'], 1)[0];
      }
    }    //if exist a backup
    if ( is_dir($old_backup) ){
      // if it isn't a folder
      if ( !is_dir($path['old']) && !is_dir($path['new']) ){
        if ( is_dir($old_backup . "/__end__") ){
          if ( ($case === 'move') || ($case === 'rename') ){

            if ( !\bbn\file\dir::move($old_backup . "/__end__", $new_backup . "/__end__", false) ){
              $this->error("Error during the file|folder backup move: old -> $old_backup , new -> $new_backup");
            }
            else {
              if ( empty(\bbn\file\dir::get_dirs($old_backup)) ){
                if ( !\bbn\file\dir::delete($old_backup) ){
                  $this->error("Error during the file|folder backup delete: old -> $old_backup");
                }
              }
            }
          }
          else if ( $case === 'delete' ){
            if ( !\bbn\file\dir::delete($old_backup) ){
              $this->error("Error during the file|folder backup delete: old -> $old_backup");
            }
          }
        }
      } //case rename backup folder
      else {
        if ( ($case === 'move') || ($case === 'rename') ){
          if ( \bbn\file\dir::copy($old_backup, $new_backup) ){
            if ( !\bbn\file\dir::delete($old_backup) ){
              $this->error("Error during the file|folder backup delete: old -> $old_backup , new -> $new_backup");
            }
          }
          else{
            $this->error("Error during the file|folder backup copy: old -> $old_backup , new -> $new_backup");
          }
        }//case delete folder
        /*else if ( $case === 'delete' ){
          if (!\bbn\file\dir::delete($old_backup)){
            $this->error("Error during the file|folder backup delete: old -> $old_backup");
          }
        }*/
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
      if ( empty($cfg['is_component']) &&
        empty($cfg['is_mvc']) &&
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
          $folder = !empty($cfg['is_file']) ? false : true;
          if ( $ope === 'delete' ){
            return $this->delete_file_preferences($f['old'], $cfg['repository'], $folder);
          }
          else if ( ($ope === 'rename') || ( $ope === 'move' ) ){
            return $this->rename_file_preferences($f['new'], $f['old'], $cfg['repository'], $folder);
          }
          return true;
        }
      }
      // MVC
      else if ( !empty($rep['tabs']) &&
       (($rep['alias_code'] === 'mvc') || ($rep['alias_code'] === 'bbn-project')) &&
       !empty($cfg['is_mvc'])
     ){
        if ( ($rep['alias_code'] === 'bbn-project') &&
         ($ope === 'delete') &&
         !empty($cfg['active_file'])
        ){
          if ( !\bbn\file\dir::delete($path.$cfg['path']) ){
            $this->error("Error during the file|folder delete: $t[old]");
            return false;
          }
          return true;
        }
        if ( $todo = $this->check_mvc($cfg, $rep, $path) ){
          foreach ( $todo as $t ){
            // Rename
            if ( ($ope === 'rename') || ($ope === 'move') ){
              if ( !\bbn\file\dir::move($t['old'], $t['new']) ){
                $this->error("Error during the file|folder move: old -> $t[old] , new -> $t[new]");
                return false;
              }
              // Change permissions
              if ( $ope === 'rename' ){

                if( empty( $this->real_to_perm($t['old']) ) &&
                  !empty($cfg['is_file']) &&
                  (strpos($t['old'], '/mvc/public/') !== false)
                ){
                  if ( !$this->create_perm_by_real($t['old']) ){
                    return $this->error("Impossible to create the option for rename");
                  }
                }
                if ( !empty($t['perms']) &&
                  !$this->change_perm_by_real($t['old'], $t['new'], empty($cfg['is_file']) ? 'dir' : 'file')
                ){
                  if( !empty( $this->real_to_perm($t['old'])) ){
                    $this->error("Error during the file|folder permissions change: old -> $t[old] , new -> $t[new]");
                    return false;
                  }
                }
              }
              else{
                if( !empty( $this->real_to_perm($t['old']) ) &&
                    !empty($cfg['is_file']) && (strpos($t['old'], '/mvc/public/') !== false)
                  ){
                  if ( !$this->create_perm_by_real($t['old']) ){
                    return $this->error("Impossible to create the option for move");
                  }
                }
                if ( !empty($t['perms']) &&
                  !$this->move_perm_by_real($t['old'], $t['new'], empty($cfg['is_file']) ? 'dir' : 'file')
                ){
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
              $this->operations_backup($t, $cfg, $ope);
            }
          }
          $folder = !empty($cfg['is_file']) ? false : true;
          if ( $ope === 'delete' ){
            //delete Preferences
            $this->delete_file_preferences($t['old'], $cfg['repository'], $folder);
          }
          if ( ($ope === 'rename') || ( $ope === 'move' ) ){
            //rename Preferences
            $this->rename_file_preferences($t['new'],$t['old'], $cfg['repository'], $folder);
          }
          return true;
        }
      }
      //case components
      else if( !empty($cfg['is_component']) ){
        // DELETE COMPONENT
        if( $ope === 'delete' && $this->delete_component($cfg) ){
          return true;
        }
        // COPY COMPONENT
        else if ( $ope === 'copy' && $this->copy_component($cfg) ){
          return true;
        }
        // RENAME COMPONENT
        else if ( $ope === 'rename' && $this->rename_component($cfg) ){
          return true;
        }
        else if ( $ope === 'move' ){
          $ele = $this->check_normal($cfg, $rep, $path);
          if ( !empty($ele) && is_array($ele) && \bbn\file\dir::move($ele['old'], $ele['new']) ){
            $this->operations_backup_components($cfg, "move");
            return true;
          }
        }
        return false;
      }
    }
    else{
      $this->error("Impossible to $ope the file|folder.");
      return false;
    }
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
   * ide constructor.
   *
   * @param \bbn\appui\options $options
   * @param $routes
   * @param \bbn\user\preferences $pref
   */
  public function __construct(\bbn\db $db, \bbn\appui\options $options, $routes, \bbn\user\preferences $pref){
    $this->db = $db;
    $this->options = $options;
    $this->routes = $routes;
    $this->pref = $pref;
    $this->_ide_path();
    $this->projects = new \bbn\appui\project($this->db);
  }


  /**
   * remover oprion of file preference
   *
   * @param string $path The path of the file
   * @return bool
   */
  public function remove_file_pref($path){
    return $this->options->remove(
      $this->options->from_code(
        $this->real_to_id($path),
        $this->_files_pref()
      )
    );
  }

  public function is_project(string $url){
    $rep = $this->repository_from_url($url);
    $repository = $this->repository($rep);
    if ( is_array($repository) && !empty($repository) ){
      if ( ($repository['alias_code'] === 'bbn-project') ){
        return true;
      }
    }
    return false;
  }


  /**
   * Checks if a repository is a Component manager
   *
   * @param string $rep
   * @return bool
   */
  public function is_component(string $rep){
    $rep = $this->repository($rep);
    if ( $rep && isset($rep['tabs']) && ($rep['alias_code']  === "components") ){
      return true;
    }
    return false;
  }

  /**
   * Checks if a repository is a Component from URL
   *
   * @param string $url
   * @return bool
   */
  public function is_component_from_url(string $url){
    $ele = explode("/",$url);

    if ( is_array($ele) ){
      //case plugin
      if ( ($ele[0] === 'BBN_LIB_PATH') && ($ele[4] === 'components') ){
        return true;
      }
      else if ( $ele[1] === 'components' ){
        return true;
      }
    }
    return $this->is_component($this->repository_from_url($url));
  }

  /**
   * Function that returns the list of tab that contains a file or not for mvc and component
   *
   * @param string $type type project of check
   * @param string $path path project
   * @return bool||array list file with property extension and value the path of the file existing or not
   */
  public function list_tabs_with_file(string $type, string $path, string $repository){

    $list = [];
    $root = $this->get_root_path($repository);
    if ( $type === 'mvc' ){
      //$id = $this->options->from_code('mvc','PTYPES', 'ide', BBN_APPUI);
      if ( is_string($path) && (strpos($path, 'mvc/') === 0) ){
        $path = str_replace('mvc/', '', $path);
      }
    }
    $tabs = $this->tabs_of_type_project($type);
    //$tabs =  $this->options->option($id)['tabs'];
    if ( is_string($path) && is_array($tabs) ){
      foreach($tabs as $tab){
        $exist= false;
        if ( $type === 'mvc' ){
          $file =  $root.'mvc/'.$tab['path'].$path.'.';
        }
        else if ( $type === 'components' ){
          $file = $root. $path.'.';
        }
        foreach($tab['extensions'] as $ext ){
          if( file_exists($file.$ext['ext']) ){
            $exist= true;
            break;
          }
        }
        if ( ($exist === false) && !in_array($tab['url'], $list) ){
          $list[] = $tab['url'];
        }
      }
      return $list;
    }
    return false;
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

  /************************** REPOSITORIES **************************/

  /**
   * Makes the repositories' configurations.
   *
   * @param string $code The repository's name (code)
   * @return array|bool
   */
  public function repositories(string $code=''){

    $paths = self::get_options(self::DEV_PATH);
    $cats = [];
    $r = [];
    if ( !empty($paths) ){
      foreach ( $paths as $path ){
        if ( isset($path['code']) && \defined($path['code']) ){
          $all = self::get_options($path['code'],self::DEV_PATH);
          foreach($all as $a){
            if ( isset($a['bbn_path']) && \defined($a['bbn_path']) ){
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
              else if( !empty($cats[$a['id_alias']]['extensions']) ){
                $r[$k]['extensions'] = $cats[$a['id_alias']]['extensions'];
              }
              else if( !empty($cats[$a['id_alias']]['types']) ){
                $r[$k]['types'] = $cats[$a['id_alias']]['types'];
              }
              unset($r[$k]['alias']);
            }
          }
        }
      }
      if ( $code ){
        return isset($r[$code]) ? $r[$code] : false;
      }
    }
    return $r;
  }

  /**
   * Gets a repository's configuration.
   *
   * @param string $code The repository's name (code)
   * @return array|bool
   */
  public function repository($code){
    return $this->projects->repository($code);
  }

  /**
   * Returns the repository's name or object from an URL.
   *
   * @param string $url
   * @param bool $obj
   * @return bool|int|string
   */
  public function repository_from_url(string $url, bool $obj = false){
    return $this->projects->repository_from_url($url, $obj);
  }

  /**
   * Checks if a repository is a MVC
   *
   * @param string $rep
   * @return bool
   */
  public function is_MVC(string $rep){
    if ( isset($this->repository($rep)['tabs']) &&
       ($this->repository($rep)['alias_code'] !== 'components')
    ){
      return true;
    }
    return false;
  }

  /**
   * Checks if a repository is a MVC from URL
   *
   * @param string $url
   * @return bool
   */
  public function is_MVC_from_url(string $url){
    if ( !empty($this->is_project($this->repository_from_url($url))) ){
      $rep = $this->repository_from_url($url, true);
      $res = $this->get_root_path($rep);
      $ele = explode("/",$url);
      if ( is_array($ele) ){
        $plugin= $this->is_plugin($res);
         //case plugin

        if ( ($plugin === true) && ($ele[4] === 'mvc') ){
          return true;
        }
        else if ( $ele[1] === 'mvc' ){
          return true;
        }
     }
      return false;
    }
    else{
     return $this->is_MVC($this->repository_from_url($url));
    }
  }


  /**
   * Replaces the constant at the first part of the path with its value.
   *
   * @param string $st
   * @return bool|string
   */
  public function decipher_path($st){
    return $this->projects::decipher_path($st);
  }

  /**
   * Gets the real root path from a repository's id as recorded in the options.
   *
   * @param string|array $repository The repository's name (code) or the repository's configuration
   * @return bool|string
   */
  public function get_root_path($repository){
    return $this->projects->get_root_path($repository);
  }

  /************************ END REPOSITORIES ************************/

  /************************** ACTIONS **************************/

  /**
   * (Load)s a file.
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
        'repository' => $real['repository']['code'],
        'file' => self::$current_file
      ];
      if ( is_file(self::$current_file) ){
        $f['value'] = file_get_contents(self::$current_file);
        if ( $preferences = $this->get_file_preferences($url) ){
          $f = array_merge($f, $preferences);
        }
        if ( $permissions = $this->get_file_permissions() ){
          $f = array_merge($f, $permissions);
          if ( $id_opt = $this->option_id() ){
            $val_opt = $this->options->option($id_opt);
          }
          if( !empty($val_opt) ){
            foreach ( $f as $n => $v ){
              if ( isset($val_opt[$n]) ){
                $f[$n] = $val_opt[$n];
              }
            }
          }
        }
      }
      /*
      else if ( !empty($real['tab']) &&
        !empty($real['repository']['tabs'][$real['tab']]['extensions'][0]['default'])
      ){
        $f['value'] = $real['repository']['tabs'][$real['tab']]['extensions'][0]['default'];
      }
      */
      else if ( !empty($real['tab']) &&
       ( ($i = \bbn\x::find($real['repository']['tabs'], ['url' => $real['tab']])) !== false )
      ){
        if( !empty($real['repository']['tabs'][$i]['extensions'][0]['default']) ){
          $f['value'] = $real['repository']['tabs'][$i]['extensions'][0]['default'];
        }
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
        $backup_path = self::$backup_path . $file['repository'] . $file['path'] . $file['tab'] . '/';
        if ( is_numeric($file['ssctrl']) && ($file['ssctrl'] === 0) ){
          $backup_path = self::$backup_path . $file['repository'] . $file['tab'] . '/';
        }else{
          $backup_path = self::$backup_path . $file['repository'] . $file['path'] . $file['tab'] . '/';
        }
      }
      else {
        $backup_path = self::$backup_path;
        if ( !isset($file['repository']) ){
          $backup_path .= dirname($file['full_path']);
          $fn = \bbn\str::file_ext($file['full_path'],1);
          $backup_path .= $fn[0]. '/__end__/' . ($file['tab'] ?: $fn[1]) . '/';
        }
        else{
          $backup_path .= $file['repository']['bbn_path'] . '/' . $file['filePath'] . '/' . $file['filename'] . '/__end__/' . ($file['tab'] ?: $file['extension']) . '/';
        }
      }
      // Delete the file if code is empty and if it isn't a super controller
      if ( empty($file['code']) && ($file['tab'] !== '_ctrl') ){
        if ( @unlink(self::$current_file) ){
          // Remove permissions
          $this->delete_perm();
          if ( !empty(self::$current_id) ){
            // Remove file's preferences
          //  $this->options->remove($this->options->from_code(self::$current_id, $this->_files_pref()));
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
          if ( isset($file['line']) ){
            $arr['line'] = $file['line'];
          }
          if ( isset($file['char']) ){
            $arr['char'] = $file['char'];
          };
          $this->set_file_preferences($file['code_file_pref'], $file['repository']['id'], $arr);
        }
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
      !empty($cfg['repository']['bbn_path']) &&
      !empty($cfg['repository']['path']) &&
      !empty($cfg['name']) &&
      !empty($cfg['path']) &&
      isset($cfg['is_file'], $cfg['extension'], $cfg['tab'], $cfg['tab_path'], $cfg['type'])
    ){

      $rep = $cfg['repository'];
      $path = $this->decipher_path($rep['bbn_path'] . '/' . $rep['path']);
      if ( ($rep['alias_code'] === 'bbn-project') && !empty($cfg['type']) ){
        if ( $cfg['type'] === 'components' ){
          $path .= $cfg['path'].$cfg['name'];
        }
        if ( $cfg['type'] === 'mvc' ){
          if ( $cfg['path'] === 'mvc/' ){
            $path .= 'mvc/'.$cfg['tab_path'];
          }
          else{
            $path .= 'mvc/'.$cfg['tab_path'].$cfg['path'];
          }

        }
        if ( $cfg['type'] === 'lib' ){
          $path .= $cfg['path'];
        }
      }
      else {
        if ( !empty($cfg['tab_path']) ){
          $path .= $cfg['tab_path'];
        }
      }

      if ( ($cfg['path'] !== './') && empty($cfg['type']) ){
        $path .= $cfg['path'];
      }


      // New folder

      if ( empty($cfg['is_file']) ){
        if ( is_dir($path.$cfg['name']) ){
          $this->error("Directory exists");
          return false;
        }
        if ( (($rep['alias_code'] !== 'bbn-project')) ||
          (($rep['alias_code'] === 'bbn-project') && !empty($cfg['type'])) &&
           ($cfg['type'] !== 'components'
          )
        ){
          $path .= $cfg['name'];
        }
        if ( !\bbn\file\dir::create_path($path) ){
          $this->error("Impossible to create the directory");
          return false;
        }
        return true;
      }
      // New file
      else if ( !empty($cfg['is_file']) && !empty($cfg['extension']) ){
        $file = $path .'/'. $cfg['name'] . '.' . $cfg['extension'];
        $file = str_replace('//','/', $file);
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
        if ( (empty($cfg['type']) || ($cfg['type'] !== 'components')) &&
          !empty($cfg['tab']) && ($cfg['tab'] === 'php') && !empty($file)
        ){
          if ( !$this->create_perm_by_real($file) ){
            return $this->error("Impossible to create the option");
          }
        }
        return true;
      }
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

  /********************** END ACTIONS **************************/

  /************************** PERMISSIONS **************************/

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
   * Creates a permission option from a real file/dir's path
   *
   * @param string $file The real file/dir's path
   * @param string $type The type of real (file/dir)
   * @return bool
   */
  public function create_perm_by_real(string $file, string $type = 'file'): bool
  {
    if ( !empty($file) &&
      \is_dir(\bbn\mvc::get_app_path()) &&
      // It must be a controller
      (strpos($file, '/mvc/public/') !== false)
    ){
      $is_file = $type === 'file';
      // Check if it's an external route
      foreach ( $this->routes as $r ){
        if ( strpos($file, $r['path']) === 0 ){
          // Remove route
          $f = substr($file, \strlen($r['path']), \strlen($file));
          // Remove /mvc/public
          $f = substr($f, \strlen('/mvc/public'), \strlen($f));
          // Add the route's name to path
          $f = $r['url'] . '/' . $f;
        }
      }
      // Internal route
      if ( empty($f) ){
        $root_path = \bbn\mvc::get_app_path().'mvc/public/';
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
  public function delete_perm($file = null): bool
  {
    if ( empty($file) ){
      $file = self::$current_file;
    }
    if ( !empty($file) && ($id_opt = $this->real_to_perm($file)) && $this->options->remove($id_opt) ){
      return true;
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
  public function change_perm_by_real(string $old, string $new, string $type = 'file'):  bool
  {
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
  public function move_perm_by_real(string $old, string $new, string $type = 'file'): bool
  {
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
      \is_dir(\bbn\mvc::get_app_path()) &&
      // It must be a controller
      (strpos($file, '/mvc/public/') !== false)
    ){

      $is_file = $type === 'file';

      // Check if it's an external route
      foreach ( $this->routes as  $r ){

        if ( strpos($file, $r['path']) === 0 ){
          // Remove route
          $f = substr($file, \strlen($r['path']), \strlen($file));
          // Remove /mvc/public
          $f = substr($f, \strlen('/mvc/public'), \strlen($f));
          // Add the route's name to path
          $f = $r['url'] . '/' . $f;

          break;
        }

      }
      // Internal route
      if ( empty($f) ){
        $root_path = \bbn\mvc::get_app_path().'mvc/public/';
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

  /********************** END PERMISSIONS **************************/

  /********************** PREFERENCES **************************/

  /**
   * Gets file's preferences
   *
   * @param string $url The url file
   * @return array|null
   */
  public function get_file_preferences(string $url = null): ?array
  {
    if ( !is_null($url) ){
      $real = $this->url_to_real($url, true);
      if ( !empty($real) ){
        $file = substr($real['file'], strpos($real['file'],'src/',1)+4);
        if (
          !empty($file) &&
          !empty($real['repository']['id']) &&
          ($id_option = $this->options->from_code($file, $real['repository']['id']))
        ){
          $pref = $this->options->option($id_option);
          if ( !empty($pref) ){
            return [
              'selections' => $pref['selections'] ?: [],
              'marks' => isset($pref['marks']) ? $pref['marks'] : [],
              'line' => (int)$pref['line'] ?: 0,
              'char' => (int)$pref['char'] ?: 0,
            ];
          }
        }
      }
    }
    return null;
  }

  /**
     * Sets user's preferences for a file.
     *
     * @param string $file_code code file preference
     * @param string $id_repository The id parent repository
     * @param array $cfg The user's preferences
     * @param string $md5 The file's md5
     *
     * @return string|null
     */
  public function set_file_preferences(string $file_code, string $id_repository, array $cfg = [], bool $force = false, string $md5 = null): ?String
  {
    if ( !empty($file_code) &&
      !empty($id_repository) &&
      !empty($this->pref) &&
      !empty($this->options) &&
      !empty($cfg)
    ){
      if ( !empty($md5) ){
        $val['md5'] = $md5;
      }
      if ( isset($cfg['selections']) ){
        $val['selections'] = $cfg['selections'];
      }
      if ( isset($cfg['marks']) ){
        $val['marks'] = $cfg['marks'];
      }
      if ( isset($cfg['line']) ){
        $val['line'] = $cfg['line'];
      }
      if ( isset($cfg['char']) ){
        $val['char'] = $cfg['char'];
      }

      $id_option = $this->options->from_code($file_code, $id_repository);
      if ( !empty($id_option) ){
        if ( $force || ($this->options->get_value($id_option) != $val) ){
          if ( $this->options->set_value($val, $id_option) !== null ){
           return $id_option;
          }
        }
      }
      else{
        $id_option = $this->options->add([
          'id_parent' => $id_repository,
          'code' => $file_code,
          'text' => $file_code,
          'value' => $val
        ]);
        return !empty($id_option) ? $id_option : null;
      }
    }
    return null;
  }

  /**
     * Rename preferences for a file.
     *
     * @param string $new_path for new code file preference
     * @param string $old_path for new code file preference
     * @param array $repository all info repository
     * @param bool $parent if set at trure rename many element who contain
     *
     * @return null|bool
     */
    public function rename_file_preferences(string $new_path, string $old_path, array $repository, bool $parent = false): ?bool
    {

      if ( !empty($new_path) &&
        !empty($old_path) &&
        !empty($repository) &&
        !empty($this->pref) &&
        !empty($this->options)
      ){
        $new_path = $this->real_to_id($new_path);
        $old_path = $this->real_to_id($old_path);

        //local function to treat a part of the file path
        $transform = function($ele, $add, $type){
          $ele = explode($type, $ele);
          $ele[1] = $add;
          return \bbn\str::parse_path(implode($type, $ele));
        };

        if ( !empty($new_path) && !empty($old_path) && (count($files = $this->get_list_preferences($repository['id'], true)) > 0) ){
          //get code of the file preference
          $new_opt_code =  substr($new_path, strlen($repository['bbn_path'].$repository['code']), strlen($new_path));
          $old_opt_code =  substr($old_path, strlen($repository['bbn_path'].$repository['code']), strlen($old_path));

          $type =  explode("/", $old_opt_code)[0];

          $tabs = [];
          $exts = [];

          //takes tabs and extensions dynamically based on the environment they belong to
          if ( !empty($repository['tabs']) ){
            foreach( $repository['tabs'] as $tab ){
              $tabs[] = $tab['path'];
              foreach( $tab['extensions'] as $ext ){
                if ( !in_array($ext['ext'], $exts) ){
                  $exts[] = $ext['ext'];
                }
              }
            }
          }
          else if (  !empty($repository['extensions']) ){
            foreach( $repository['extensions'] as $ext ){
              if ( !in_array($ext['ext'], $exts) ){
                $exts[] = $ext['ext'];
              }
            }
          }

          $check = true;
          //rename elements mvc or not
          if ( !$parent ){
            //cas mvc
            if ( $type === 'mvc' ){
              foreach($tabs as $tab){
                if ( $check ){
                  $old_opt_code = $transform($old_opt_code, $tab, '/');
                  $new_opt_code = $transform($new_opt_code, $tab, '/');
                  foreach( $exts as $ext ){
                    $old_opt_code = $transform($old_opt_code, $ext, '.');
                    $new_opt_code = $transform($new_opt_code, $ext, '.');
                    if ( (($i = \bbn\x::find($files, ['code' => $old_opt_code])) !== false) &&
                      ((\bbn\x::find($files, ['code' => $new_opt_code])) === false)
                    ){
                      //if there is file then change
                      if ( !empty($files[$i]['id']) ){
                        $props = [
                          'code' => $new_opt_code,
                          'text' => $new_opt_code
                        ];

                        if ( empty($this->options->set_prop($files[$i]['id'], $props)) ){
                          $check = false;
                          break;
                        }
                      }
                    }
                  }
                }
                else{
                  break;
                }
              }
            }
            //case no mvc
            else{
              foreach( $exts as $ext ){
                if ( $check ){
                  $old_opt_code = $transform($old_opt_code, $ext, '.');
                  $new_opt_code = $transform($new_opt_code, $ext, '.');
                  if ( (($i = \bbn\x::find($files, ['code' => $old_opt_code])) !== false) &&
                    ((\bbn\x::find($files, ['code' => $new_opt_code])) === false)
                  ){
                    //if there is file then change
                    if ( !empty($files[$i]['id']) ){
                      $props = [
                        'code' => $new_opt_code,
                        'text' => $new_opt_code
                      ];
                      if ( empty($this->options->set_prop($files[$i]['id'], $props)) ){
                        $check = false;
                        break;
                      }
                    }
                  }
                }
                else{
                  break;
                }
              }
            }
            return $check;
          }
          //case rename foleder who folder that contains elements
          else {
            if ( $type === 'mvc'){
              foreach($tabs as $tab){
                if ( $check ){
                  $folder_pref = $transform($old_opt_code, $tab, '/');
                  foreach( $files as $file ){
                    if ( !empty($file['id']) &&
                      !empty($file['code']) &&
                      (strpos($file['code'], $folder_pref) === 0)
                    ){
                      $props = [
                        'code' => str_replace($folder_pref, $new_opt_code, $file['code']),
                        'text' => str_replace($folder_pref, $new_opt_code, $file['code'])
                      ];
                      if ( empty($this->options->set_prop($file['id'], $props)) ){
                        $check = false;
                        break;
                      }
                    }
                  }
                }
                else{
                  break;
                }
              }
            }//case single element
            else {
              foreach( $files as $file ){
                if ( !empty($file['id']) &&
                  !empty($file['code']) &&
                  (strpos($file['code'],$old_opt_code) === 0)
                ){
                  $props = [
                    'code' => str_replace($old_opt_code, $new_opt_code, $file['code']), 
                    'text' => str_replace($old_opt_code, $new_opt_code, $file['code'])
                  ];
                  if ( empty($this->options->set_prop($file['id'], $props)) ){
                    $check = false;
                    break;
                  }
                }
              }
            }
          }
          return $check;
        }
      }
      return null;
    }


  /**
   * Removes a file from preferences
   *
   * @param string $path The file's file
   * @param array $repository all info repository
   * @param bool $parent if set at trure rename many element who contain
   *
   * @return null|bool
   */
  public function delete_file_preferences(string $path, array $repository, bool $parent = false): ?bool
  {
    if ( !empty($path) &&
        !empty($repository) &&
        !empty($this->pref) &&
        !empty($this->options)
    ){
      $check = true;
      $path = $this->real_to_id($path);
      //get code of the file preference
      $file_pref =  substr($path, strlen($repository['bbn_path'].$repository['code'])+1, strlen($path));

      if ( !empty($file_pref) && (count($preferences = $this->get_list_preferences($repository['id'], true)) > 0) ){
        $type =  explode("/", $file_pref)[0];
        $tabs = [];
        $exts = [];

        //takes tabs and extensions dynamically based on the environment they belong to
        if ( !empty($repository['tabs']) ){
          foreach( $repository['tabs'] as $tab ){
            $tabs[] = $tab['path'];
            foreach( $tab['extensions'] as $ext ){
              if ( !in_array($ext['ext'], $exts) ){
                $exts[] = $ext['ext'];
              }
            }
          }
        }
        else if (  !empty($repository['extensions']) ){
          foreach( $repository['extensions'] as $ext ){
            if ( !in_array($ext['ext'], $exts) ){
              $exts[] = $ext['ext'];
            }
          }
        }
        //local function to treat a part of the file path
        $transform = function($ele, $add, $type){
          $ele = explode($type, $ele);
          $ele[1] = $add;
          return \bbn\str::parse_path(implode($type, $ele));
        };

        //case element mvc or not
        if ( !$parent ){
          //case mvc
          if ( $type === 'mvc' ){
            foreach($tabs as $tab){
              if ( $check ){
                $file_pref = $transform($file_pref, $tab, '/');
                foreach( $exts as $ext ){
                  $file_pref = $transform($file_pref, $ext, '.');
                  //get all the pre preference of the repository
                  if ( ($i = \bbn\x::find($preferences, ['code' => $file_pref])) !== false ){
                    //get id file preference
                    if ( !empty($preferences[$i]['id']) ){
                      //After deleting all the reference bits, the preference option will be deleted
                      //first remove all bits with this option
                      if ( ($this->delete_bits_preferences($preferences[$i]['id']) === false) ){
                        $check = false;
                        break;
                      }//after felete option
                      else if ( empty($this->options->remove($preferences[$i]['id'])) ){
                        $check = false;
                        break;
                      }
                    }
                  }
                }
              }
              else{
                break;
              }
            }
            return $check;
          }
          else{
            //for component
            if ( $type === 'components' ){
              $name = '/'.\bbn\str::file_ext($file_pref, 1)[0];
              $file_pref = explode(".", $file_pref);
              $file_pref[0] .= '/'.$name;
              $file_pref = implode(".", $file_pref);
            }
            foreach( $exts as $ext ){
              if ( $check ){
                $file_pref = $transform($file_pref, $ext, '.');
                //get id file preference
                if ( ($i = \bbn\x::find($preferences, ['code' => $file_pref])) !== false ){
                  //After deleting all the reference bits, the preference option will be deleted
                  //first remove all bits with this option
                  if ( ($this->delete_bits_preferences($preferences[$i]['id']) === false) ){
                    $check = false;
                    break;
                  }//after felete option
                  else if ( empty($this->options->remove($preferences[$i]['id'])) ){
                    $check = false;
                    break;
                  }
                }
              }
              else{
                break;
              }
            }
            return $check;
          }
        }//case folder
        else{
          if ( $type === 'mvc'){
            foreach($tabs as $tab){
              if ( $check ){
                $file_pref = $transform($file_pref, $tab, '/');
                foreach( $preferences as $file ){
                  if ( !empty($file['id']) &&
                    !empty($file['code']) &&
                    (strpos($file['code'], $file_pref) === 0)
                  ){
                    //first remove all bits with this option
                    if ( ($this->delete_bits_preferences($file['id']) === false) ){
                      $check = false;
                      break;
                    }//after felete option
                    else if ( empty($this->options->remove($file['id'])) ){
                      $check = false;
                      break;
                    }
                  }
                }
              }
              else{
                break;
              }
            }
            return $check;
          }
          else{
            foreach( $preferences as $file ){
              if ( !empty($file['id']) &&
                !empty($file['code']) &&
                (strpos($file['code'], $file_pref) === 0)
              ){
                //After deleting all the reference bits, the preference option will be deleted
                //first remove all bits with this option
                if ( ($this->delete_bits_preferences($file['id']) === false) ){
                  $check = false;
                  break;
                }//after felete option
                else if ( empty($this->options->remove($file['id'])) ){
                  $check = false;
                  break;
                }
              }
            }
          }

        }
      }
      return false;
    }
    return null;
  }

  /******************** END PREFERENCES ************************/

  /******************** OPENED AND RECENT FILES BIT ************************/




  /**
   * Create or update bit recent file preference
   *
   * @param string $file code option
   * @param string $id_link id option file preference
   * @return bool
   */
  public function set_recent_file(string $file, string $id_link): bool
  {
    $pref = false;
    $project = explode(".", $file)[0];
    $bit = false;
    if ( !empty($id_link) &&
      ($id_recent_file =  $this->options->from_code(self::RECENT_FILE, self::IDE_PATH, self::BBN_APPUI))
    ){
      //search preference and if not exsist preference add a new
      $pref = $this->pref->get_by_option($id_recent_file);
      $id_pref = !empty($pref) ? $pref['id'] : $this->pref->add($id_recent_file, []);
    }
    //search bit in relation at user preference
    $bit_data = $this->get_bit_by_option($id_link, $id_pref);

    $date = date('Y-m-d H:i:s');
    $cfg =[];
    //set bit
    if ( !empty($id_pref) && ($bit_data !== null) ){
      $info= json_decode($bit_data['cfg'], true);
      $cfg = [
        'id_option' => $id_link,
        'text' => $file,
        'cfg' => [
          'bit_creation' => $info['bit_creation'],
          'last_date' => $date,
          'number' => $info['number'] + 1
        ]
      ];
      if ( !empty($this->pref->update_bit($bit_data['id'], $cfg, true)) ){
        $bit = true;
      }
    }
    //add bit
    else{
      $cfg = [
        'bit_creation' => $date,
        'last_date' => $date,
        'number' => 0
      ];
      if ( !empty($id_pref) && $this->pref->add_bit($id_pref,[
        'id_option' => $id_link,
        'cfg' =>  json_encode($cfg),
        'text' => $file
        ])
      ){
        $bit = true;
      }
    }
    return !empty($bit) && !empty($id_pref);
  }

  /**
   * Add or update option file in repository
   *
   * @param string| $id_rep The file's ID
   * @return bool
   */
  public function set_opened_file(string $id_rep, string $file_code, array $info, bool $setRecent = true): bool
  {
    $bit = false;
    //file preference in repository
    $id_pref_file = $this->set_file_preferences($file_code, $id_rep, $info, true);

    if ( !empty($id_pref_file) &&
      ($id_option_opened =  $this->options->from_code(self::OPENED_FILE,self::IDE_PATH, self::BBN_APPUI))
    ){
      //search preference and if not exsist preference add a new
      $pref = $this->pref->get_by_option($id_option_opened);
      $id_pref = !empty($pref) ? $pref['id'] : $this->pref->add($id_option_opened, []);
    }

    //search bit  for setting or add
    $bit_data = $this->get_bit_by_option($id_pref_file, $id_pref);


    if ( !empty($id_pref) && ($bit_data !== null) ){
      $cfg = [
        'cfg' =>[
          'last_open' => date('Y-m-d H:i:s')
        ]
      ];
      //set bit why exist
      if (!empty($this->pref->update_bit($bit_data['id'], $cfg, true)) ){
        $bit = true;
      }
    }//add bit why not exist
    else {
      $cfg = [
        'last_open' => date('Y-m-d H:i:s')
      ];
      //TEMPORANEY delete all bits for id_user option with option 'opened file'
      /*$bits = $this->pref->get_bits($id_pref);
      if ( !empty($bits) ){
        $delete_bits = $this->pref->delete_bits($id_pref);
        if ( $delete_bits < 1 ){
          return false;
        };
      }
      $cfg = [
        'last_open' => date('Y-m-d H:i:s')
      ];*/

      if ( !empty($id_pref) && $this->pref->add_bit($id_pref,[
        'id_option' => $id_pref_file,
        'cfg' => json_encode($cfg),
        'text' => $file_code
        ])
      ){
        $bit = true;
      }
    }
    if ( $setRecent ){
      return !empty($bit) && !empty($id_pref_file) && !empty($id_pref) && $this->set_recent_file($file_code, $id_pref_file);
    }
    else{
      return !empty($bit) && !empty($id_pref_file) && !empty($id_pref);
    }
  }

  /**
   * return list files preferences
   *
   * @param integer $limit file numbers to be taken
   * @return null|array
   */
  public function get_recent_files( int $limit = 10 ): ?array
  {
    $perm = $this->options->from_code(self::RECENT_FILE, self::IDE_PATH, self::BBN_APPUI);
    $all = [];
    if ( !empty($perm) ){
      $pref = $this->pref->get_by_option($perm);
      if ( !empty($pref['id']) ){
        $pref_arch = $this->pref->get_class_cfg();
        $recents =  $this->db->rselect_all([
          'table' => $pref_arch['tables']['user_options_bits'],
          'fields' => [
            $pref_arch['arch']['user_options_bits']['id'],
            $pref_arch['arch']['user_options_bits']['id_user_option'],
            $pref_arch['arch']['user_options_bits']['id_option'],
            $pref_arch['arch']['user_options_bits']['cfg'],
            $pref_arch['arch']['user_options_bits']['text'],
            'date' => 'bbn_users_options_bits.cfg->"$.last_date"',
            'num' => 'bbn_users_options_bits.cfg->"$.number"'
          ],
          'where' => [
            'conditions' => [[
              'field' => $pref_arch['arch']['user_options_bits']['id_user_option'],
              'value' => $pref['id']
            ]]
          ],
          'limit' => 10,
          'order' =>['date' => "DESC"]
        ]);
        foreach ( $recents as $id => $bit ){
          $file_pref = $this->options->option($bit['id_option']);
          $repository = $this->options->option($file_pref['id_parent']);
          //path for link
          $type = explode("/",$file_pref['code'])[0];
          $path_file = explode(".", $bit['text'])[0];
          $path_file = explode("/",$path_file);
          $file_code = array_shift($path_file);
          if ( ($type !== 'mvc') && ($type !== 'components') ){
            $tab = 'code';
            $type = '';
            $file = $file_code;
          }
          else{
            $tab = array_shift($path_file);
            $type .= '/';
            $tab = $tab === 'public' ? 'php' : $tab;
            $file = implode("/",$path_file);
          }
          $path = \bbn\str::parse_path('file/'.$repository['bbn_path'].'/'.$repository['code'].'/'.$type.$file.'/_end_/'.$tab);
          $all[] = [
            'cfg' => $bit['cfg'],
            'file' =>  \bbn\str::parse_path($repository['code'].'/'.$file_pref['code']),
            'repository' =>  $repository['code'],
            'path' => $path,
            'type' => $type === '' ? false : $type
          ];
        }
      }
    }
    return !empty($all) ? $all : null;
  }

  /******************** END OPENED AND RECENT FILES ************************/



  /*************************** FILE ***************************/

  /**
   * Returns the file's URL from the real file's path.
   *
   * @param string $file The real file's path
   * @return bool|string
   */
  public function real_to_url(string $file){
    return $this->projects->real_to_url($file);
  }

  /**
   * check if $path is of a plugin
   *
   * @param string $path
   * @return bool
   */
  public function is_plugin($path){
    $plugin = false;
    if ( is_array($this->routes) ){
      foreach( $this->routes as $route ){
        if ( $path === $route['path'].'src/'){
          $plugin = true;
          break;
        }
      }
    }
    return $plugin;
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

      $plugin = $this->is_plugin($res);

      if ( $rep['alias_code'] === 'bbn-project' ){
        $bits = explode('/', substr($url, \strlen($rep['bbn_path'].$rep['path'])));

        if ( !empty($this->is_component_from_url($url)) &&
             //!empty($idx = $this->options->from_code('components','PTYPES',$this->_ide_path()))
             !empty($ptype = $this->get_type('components'))
        ){
          //$ptype = $this->options->option($idx);
          $rep['tabs'] = $ptype['tabs'];
        }
        if ( !empty($this->is_MVC_from_url($url)) &&
             //!empty($idx = $this->options->from_code('mvc','PTYPES',$this->_ide_path()))
             !empty($ptype = $this->get_type('mvc'))
        ){
          $rep['tabs'] = $ptype['tabs'];
          if ( $plugin ){
            array_shift($bits);
            array_shift($bits);
          }
        }
      }
      else{
        //for lib in current temporaney code
        if ( ($rep['bbn_path'] === "BBN_APP_PATH") && (strpos($url,$rep['bbn_path'].'/'.$rep['code']) === 0) ){
          $url = str_replace($rep['bbn_path'].'/'.$rep['code'], $rep['bbn_path'].'/'.$rep['path'], $url);
        }
        $bits = explode('/', substr($url, \strlen($rep['bbn_path'].'/'.$rep['path'])));
      }
      $o = [
        'mode' => false,
        'repository' => $rep,
        'tab' => false
      ];
      if ( !empty($bits) ){
        // Tab's nane
        if ( !empty($rep['tabs']) && (end($bits) !== 'code') ){

          // Tab's nane
          $tab = array_pop($bits);
          // File's name
          $fn = array_pop($bits);

          // File's path
          if ( !$plugin ){
            array_shift($bits);
          }
          $fp = implode('/', $bits);

          // Check if the file is a superior super-controller
          $ssc = $this->superior_sctrl($tab, $fp);

          $tab = $ssc['tab'];



          if ( $plugin ){
            if ( empty($this->is_component_from_url($url)) ){
              $tab = $tab === 'settings' ? 'php' : $tab;
            }
          }

          $o['tab'] = $tab;
          $fp = $ssc['path'].'/';


          if ( ($i = \bbn\x::find($rep['tabs'], ['url' => $tab])) !== false ){
            $tab = $rep['tabs'][$i];
            // if( !empty($this->is_MVC_from_url($url)) && ($plugin === true) ){
            //   $res .= 'mvc/';
            // }
            if( !empty($this->is_MVC_from_url($url)) ){
              $res .= 'mvc/';
            }

            if( empty($this->is_component_from_url($url)) ){
              $res .= $tab['path'];
            }
            else if( !empty($this->is_component_from_url($url)) && !$plugin ){
              $res .= 'components/';
            }
            if ( !empty($tab['fixed']) ){
              $res .= $fp . $tab['fixed'];
              $o['mode'] = $tab['extensions'][0]['mode'];
              $o['ssctrl'] = $ssc['ssctrl'];
            }
            else {
              $res .=  $fp . $fn;
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
        /*else if( !empty($rep['alias_code']) && ($rep['alias_code'] === 'bbn-project') ){
          // Tab's nane
          $tab = array_pop($bits);
          $res .= implode('/', $bits);
          if ( !empty($this->is_component_from_url($url)) && !empty($idx =               $this->options->from_code('components','PTYPES',$this->_ide_path()))
          ){
            $ptype = $this->options->option($idx);
            $rep['extensions'] = [];
            $rep['tabs'] = $ptype['tabs'];
            foreach( $rep['tabs'] as $i => $tab){
              if ( $rep['tabs']['url'] === $tab ){
                $res .= $tab;
                $o['mode'] = $tab;
                $o['tab'] = $tab;
              }
            }
            die(\bbn\x::dump($o, $res, $rep));
          }
        }*/
        else {
          array_pop($bits);
          $res .= implode('/', $bits);
          if( is_array($rep) ){
            //temporaney for lib plugin
            if ( !empty($rep['extensions'] ) ){
              foreach ( $rep['extensions'] as $ext ){
                if ( is_file("$res.$ext[ext]") ){
                  $res .= ".$ext[ext]";
                  $o['mode'] = $ext['mode'];
                }
              }
            }
            else{
              if ( is_file($res.'.php') ){
                $res .= ".php";
                $o['mode'] = 'php';
              }
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
   * Returns the file's ID from the real file's path.
   *
   * @param string $file The real file's path
   * @return bool|string
   */
  public function real_to_id($file){
    if ( ($rep = $this->repository_from_url($this->real_to_url($file), true)) && \defined($rep['bbn_path']) ){
      $bbn_p = $rep['bbn_path'] === 'BBN_APP_PATH' ? \bbn\mvc::get_app_path() : constant($rep['bbn_path']);
      if ( strpos($file, $bbn_p) === 0 ){
        $f = substr($file, \strlen($bbn_p));
        return \bbn\str::parse_path($rep['bbn_path'].'/'.$f);
      }
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

  /************************* END FILE *************************/

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
    $path = self::$backup_path . $url;


    if ( !empty($url) && !empty(self::$backup_path) ){
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
       if ( is_dir($ctrl_path) ){

           //If there is a "_ctrl" backup, insert it into the array that will be merged with the remaining backup at the end of the function.
           if ( $files_ctrl = \bbn\file\dir::get_files($ctrl_path) ){

             $mode = basename($ctrl_path);

             $history_ctrl = [
               'text' => basename($ctrl_path),
               'icon' => 'folder-icon',
               'folder' => true,
               'items' => [],
               'num_items' => \count(\bbn\file\dir::get_files($ctrl_path))
               //'num_items' => \count(\bbn\file\dir::get_files($files_ctrl))
             ];

             //If we are requesting all files with their contents, this block returns to the "_ctrl" block.
             if ( $all === true ){

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
            $path = self::$backup_path . $url;
          }

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

  /**
   * Returns all data of type repository
   *
   * @param string $type name ohf type
   * @return array|bool
   */
  public function get_type(string $type){
    if ( !empty($type) ){
      return self::get_appui_option($type, self::PATH_TYPE);
    }
  }

  /**
   * Returns all data of all types repository
   *
   * @return array|bool
   */
  public function get_types(){

    return self::get_appui_option(self::PATH_TYPE);

  }

  /**
   * Returns the tabs of type repository
   *
   * @param string $type name ohf type
   * @return array|bool
   */
  public function tabs_of_type_project(string $type){
    if ( !empty($type) && ($ptype = $this->get_type($type))){
      return !empty($ptype['tabs']) ? $ptype['tabs'] : false;
    }
  }

  /*public function history(string $url){
    if ( !empty($url) && !empty(self::$backup_path) ){
      $backups = [];
      // File's backup path
      $path = self::$backup_path . $url;
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