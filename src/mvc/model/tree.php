<?php

use bbn\x;

/** @var $model \bbn\mvc\model */
if ($model->has_data(['repository', 'repository_cfg'], true)) {

  $rep_cfg      = $model->data['repository_cfg'];
  $is_mvc       = $model->has_data('is_mvc', true);
  $is_component = $model->has_data('is_component', true);
  $is_project   = $model->has_data('is_project', true) && empty($is_mvc) && empty($is_component);
  $onlydirs     = $model->has_data('onlydirs', true);

  //for tree in the popup
  $tree_popup = $model->has_data('tree_popup', true);


  // Defining current path
  //case of a component we treat the '$current_path' differently
  if ($model->has_data('is_vue', true)) {
    $cur_path = explode('/', $model->data['uid']);
    array_pop($cur_path);
    $cur_path = implode('/', $cur_path);
    $cur_path .= '/';
  }
  else{
    $cur_path = empty($model->data['uid']) ? '' : $model->data['uid'] . '/';
     //treat the curent path for the initial date
    if ($model->has_data('type', true) && ($model->data['type'] === 'mvc')) {
      $cur_path = explode('/', $cur_path);
      if ((count($cur_path) > 0) && ($cur_path[0] === 'mvc')) {
        array_shift($cur_path);
      }

      $cur_path = implode('/', $cur_path);
    }
  }

  //check backslash
  while (strpos($cur_path, '//') !== false) {
    $cur_path = str_replace('//', '/', $cur_path);
  }

  // Get the repository's root path

  $path = $model->inc->ide->get_root_path($rep_cfg);


  //die(x::dump($cur_path, $rep_cfg, $is_mvc, $is_component, $is_project, $onlydirs, $tree_popup, $model->data));
  $difference_git = $model->get_cached_model('./git', ['path' => dirname($path)], 3600);
  //$difference_git = $model->get_model('./git', ['path' => dirname($path)]);

  //extensions list not to be considered
  $file_check = [
    'viewables' => [
      'html',
      'htm',
      'php',
      'sql',
      'mysql',
      'js',
      'ts',
      'py',
      'txt',
      'log',
      '',
      'css',
      'scss',
      'less',
      'htaccess',
      'htpasswd',
      'svg',
      'conf'
    ],
    'images' => [
      'jpg',
      'jpeg',
      'gif',
      'png'
    ]
  ];
  // Files' extensions excluded
  $excludeds = [
    'svn',
    'notes',
    'git',
    'bak',
    'lang',
    'json'
  ];

  //element root exluded in case project
  $types_to_include = [];
  if ( isset($model->data['repository_cfg']['types']) ){
    foreach( $model->data['repository_cfg']['types'] as $type ){
      $types_to_include[] = $type['url'];
    }
  }

  // List of folders
  $folders = [];
  // List of files
  $files = [];

  $opt = $model->inc->options;
  $type = !empty($model->data['type']) ? $model->data['type'] : false;

  //function return olny dirs not hidden
  $dirs = function($dir) use($model){
    if ( !empty($folders = $model->inc->fs->get_dirs($dir)) ){
      if ( is_array($folders) ){
        if( count($folders) > 0 ){
          foreach ($folders as $i => $folder){
            if ( strpos($folder, '.') === 0 ){
              unset($folders[$i]);
            }
          }
          return $folders;
        }
        else{
          return [];
        }
      }
    }
    else{
      return false;
    }
  };

  // function check git
  $check_git = function($ele) use($difference_git){
    $info_git = false;
    if ( !empty($difference_git['ide']) ){
      foreach( $difference_git['ide'] as $commit ){
        $info_git = strpos($commit['ele'], $ele) === 0;
        if ( !empty($info_git) ){
          return $info_git;
        }
      }
    }
    return $info_git;
  };

  // function for create the node for tree
  $get = function($real, $color, $tab = false, $type = false, $types =[]) use(&$folders, &$files,$check_git ,  $onlydirs,$cur_path, $file_check, $excludeds, $opt, $types_to_include, $is_project, $tree_popup, $dirs, $model){
    if( !empty($real) && !empty(strpos($real,'//')) ){
      $real = str_replace('//','/', $real);
    }
    //if the element exists
    if ( !empty($real) ){

      $todo = !empty($onlydirs) ? $dirs($real) : $model->inc->fs->get_files($real, true);
      if ( is_array($todo) ){
        //we browse the element
        foreach ( $todo as $t ){
          //we can only enter if it is a component type and there is no other child element with the same name or that is not a component type
          if ( ((((\bbn\str::file_ext($t, 1)[0] !== basename($cur_path)) && $model->inc->fs->is_dir($t)) && ($type === 'components')) ||  ($type !== 'components')) &&
           (strpos(basename($t),".") !== 0)
          ){
            $component = false;
            $is_vue = false;
            $name = basename($t);

            //filter any folders that we want to see in the root in case of a project
            if ( empty($is_project) ||
              !empty($tree_popup) ||
              (!empty($is_project) &&
               ((!empty( $types_to_include) && empty($type) && in_array($name, $types_to_include, true)) || !empty($type))
              )
            ){


              //we take the file name if it is not '_ctrl'
              if ( $name !== '_ctrl.php' ){
                //take note if it is a file or not the element
                $is_file = $model->inc->fs->is_file($t);
                //if it's a file we take the name and extension distinctly
                if ( $is_file ){
                  // File extension
                  $ext = \bbn\str::file_ext($t);
                  $name = \bbn\str::file_ext($t, 1)[0];
                }
                //we enter only a file not repeating for each extension and that the file we are dealing with does not have the extension in the list of excluded or that we take a folder not taken before

                if (
                  ($is_file && !isset($files[$name]) && !\in_array($ext, $excludeds)) ||
                  (!$is_file && (!isset($folders[$name]) || $folders[$name]['numChildren'] === 0))
                ){
                  $num = 0;
                  //case folder
                  if ( empty($is_file) ){
                    if ( (empty($onlydirs) && ($tf = $model->inc->fs->get_files($t, true))) ||
                      (!empty($onlydirs) && ($tf = $dirs($t)))
                    ){

                      $num = \count($tf);
                    }
                  }
                  //if is type and is components
                  if ( $type === 'components' ){
                    //if is the component
                    if( empty($dirs($t)) && !empty($cnt = $model->inc->fs->get_files($t)) ){
                      $component = true;
                      $num = 0;
                      $folder = false;
                      if ( is_array($cnt) ){
                        foreach($cnt as $f){
                          $item = explode(".", basename($f))[0];
                          if ( $item === basename($t) ){
                            $arr[] = \bbn\str::file_ext($f);
                            $is_vue = true;
                          }
                        }
                      }
                    }
                    elseif ( empty($model->inc->fs->get_files($t, true)) ){
                      $component = false;
                      $num = 0;
                      $folder = true;
                    }
                    //else is folder
                    elseif ( ($cnt = $model->inc->fs->get_files($t, true, true)) ){
                      $num =  \count($cnt);
                      $folder = true;
                      $arr = [];
                      $component = false;
                      $num_check = 0;

                      if ( is_array($cnt) ){
                        $num_check = 0;
                        foreach( $cnt as $f ){
                          //$name = explode(".", basename($f))[0];
                          $ele = explode(".", basename($f));
                          $item = $ele[0];
                          $ext = isset($ele[1]) ? $ele[1] : false;
                          //if is folder and component
                          if ( $item === basename($t) ){
                            $folder = false;
                            $arr[] = \bbn\str::file_ext($f);
                            $is_vue = true;
                            $component = true;
                            if ( !empty($ext) && (in_array($ext, $excludeds) === false) ){
                              $num_check++;
                            }
                          }
                        }

                        if( $num > 0 ){
                          //for component in case file with name different or folder hidden
                          $element_exluded = 0;
                          if( $num_check < $num ){
                            foreach( $cnt as $f ){
                              $ele = explode(".", basename($f));
                              $item = $ele[0];
                              $ext = isset($ele[1]) ? $ele[1] : false;
                              if ( ($model->inc->fs->is_dir($f) && (strpos(basename($f), '.') === 0)) ||
                                ($model->inc->fs->is_file($f) && (($item !== basename($t)) || (!empty($ext) && (in_array($ext, $excludeds) === true))))
                              ){
                                $element_exluded++;
                              }
                            }
                          }
                          //check if the files of the component + those that have a different name or have hidden folders is the same as all the content, leaving only the possibility in case of folders not hidden
                          $num = $num - ($num_check + $element_exluded);
                        }

                      }
                      //in this block check check if there is the file with the extension 'js' otherwise take the first from the list and if it is php then let's say that we are in the html
                      if ( count($arr) > 0 ){
                        if( array_search('js',$arr, true) !== false ){
                          $tab = 'js';
                        }
                        else{
                          $tab = $arr[0] === 'php' ?  'html' : $arr[0];
                        }
                      }
                    }
                  }

                  //on the basis of various checks, set the icon
                  //case file but no component
                  if ( !empty($is_file) && empty($component) ){
                    if ( $ext === 'js'){
                      $icon = "icon-javascript";
                    }
                    else{
                      $icon =  "icon-$ext";
                    }
                  }
                  //case component o folder who contain other component
                  elseif ( !empty($component) && !empty($is_vue) ){
                    $icon =  "nf nf-mdi-vuejs";
                  }
                  //case folder
                  else {
                    $icon =  "nf nf-fa-folder";
                  }
                  //object return of a single node


                  $cfg = [
                    'text' => $name,
                    'name' => $name,
                    'git' =>  $check_git($t),
                    //Previously the 'uid' property was called 'path'
                    'uid' => $component === true  ? $cur_path.'/'.$name.'/'.$name : $cur_path . $name,
                    'has_index' => empty($is_file) && \bbn\file\dir::has_file($t, 'index.php', 'index.html', 'index.htm'),
                    'is_svg' => !empty($is_file) && ($ext === 'svg'),
                    'is_viewable' => !empty($is_file) && \in_array($ext, $file_check['viewables']) && ($ext !== 'svg'),
                    'is_image' => !empty($is_file) && \in_array($ext, $file_check['images']),
                    'is_vue'=> $is_vue,
                    'dir' => $cur_path,
                    'icon' => $icon,
                    'bcolor' => !empty($color) ? $color : false,
                    'folder' => !empty($folder) ? $folder : empty($is_file),
                    'lazy' => empty($is_file) && ( (empty($onlydirs) && !empty($model->inc->fs->get_files($t, true))) || (!empty($onlydirs) && !empty($dirs($t)))),
                    'numChildren' => $num,
                    'tab' => $tab,
                    'ext' => !empty($is_file) ? $ext : false
                  ];

                  if( !empty($tree_popup) ){
                    $cfg['tree_popup'] = !empty($tree_popup);
                  }
                  //based on various checks, we set the type by adding it to the cfg
                  if ( empty($type) && !empty($types) ){
                    $cfg['type'] = !empty($types[$name]) ? $types[$name] : false;
                  }
                  elseif ( !empty($type) && empty($types) ){
                    $cfg['type'] = $type;
                  }
                  elseif ( empty($type) && empty($types) ){
                    $cfg['type'] = false;
                  }
                  //add to the list of folders or files so that we traced them for the next cycle
                  if ( !empty($is_file) ){
                    $files[$name] = $cfg;
                  }
                  else {
                    if ( empty($folders[$name]) ){
                      $folders[$name] = $cfg;
                    }
                    elseif ( $cfg['numChildren'] > 0 ){
                      $folders[$name] = $cfg;
                    }
                  }
                }
                elseif ( !$is_file &&
                  !empty($component) && isset($folders[$name]) && !$folders[$name]['numChildren'] ){
                  $tf = $model->inc->fs->get_files($t, true);
                  if ( $num = \count($tf) ){
                    $folders[$name]['numChildren'] = $num;
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  //case mvc, only components or normal file but no types (case repository no current)
  if ( (!empty($is_mvc) || !empty($is_component)) ||
    empty($rep_cfg['types']) ||
    !empty($tree_popup) ||
    empty($model->data['type'])
  ){
    // Get all files and all folders of each mvc's tabs (_ctrl tab excluded)
    if ( !empty($rep_cfg['tabs']) ){
      foreach ( $rep_cfg['tabs'] as $i => $t ){
        if ( ($t['url'] !== '_ctrl') &&
         !empty($t['path']) &&
         ( empty($model->data['tab']) ||
           ( !empty($model->data['tab']) &&
             ($model->data['tab'] === $t['url'])
           )
         )
        ){//type mvc
          if( !empty($is_mvc) ){
            if ( !empty($tree_popup) ){
              $path_complete = $path . 'mvc/'. $t['path'] . $cur_path;
              $type= 'mvc';

            }
            else{
              $path_complete = $path . $t['path'] . $cur_path;
            }
          }//type components
          elseif( !empty($is_component) ){
            $path_complete =  $path . $cur_path;
            $type= 'components';
            $t['bcolor'] = '#44b782';
          }
          $get($path_complete, $t['bcolor'], $t['url'], $type);
        }
      }
    }
    else{
      $get($path .'/'. $cur_path, (!isset($rep_cfg['bcolor']) ? "#000000" : $rep_cfg['bcolor']) );
    }
  }//case root repository with alias bbn-project and contain types
  elseif ( !empty($rep_cfg['types']) && !empty($is_project) && empty($model->data['type']) ){
    $types = [];
   //browse the root elements and assign the type to each of them
    $todo = !empty($onlydirs) ? $dirs($path.$cur_path) : $model->inc->fs->get_files($path . $cur_path, true);
    foreach ( $todo as $t ){
      $ar = explode("/", $t);
      $ele = array_pop($ar);
      $idx = basename($t);
      if ( !empty($ele) ){
        foreach($rep_cfg['types'] as $element){
          if ( in_array($ele, $element) && empty($type[$idx])){
            $types[$idx] =  $element['url'];
            break;
          }
        }
      }
    }
    //we execute the function that will return the date for the tree of the ide
    $get($path . $cur_path, false, false, false, $types);
  }
  //else if we are in depth and we already know what types of elements we are opening and dealing with in the tree of the ide
  elseif( !empty($model->data['type']) ){
    if ( ($model->data['type'] === 'lib') || ($model->data['type'] === 'cli') ){
      // lib
      $get($path . $cur_path, $rep_cfg['bcolor'], false, $type);
    }
    else{
      //this function re-sends us the tabs since the repository that we are dealing with has the types and does not have direct access to corispective tabs
      //$tabs = $get_tabs_of_type($model->data['type']);
      $tabs = $model->inc->ide->tabs_of_type_project($type);
      if( !empty($tabs) ){
        foreach ( $tabs as $i => $t ){

          if ( ($t['url'] !== '_ctrl') &&
            !empty($t['path']) &&
            ( empty($model->data['tab']) ||
              ( !empty($model->data['tab']) &&
                ($model->data['tab'] === $t['url'])
              )
            )
          ){
            //case components
            if ( $model->data['type'] === 'components' ){
             // die(var_dump($path.$cur_path));
              $get($path.$cur_path , '#44b782', $t['url'], $type);
            }
            //case mvc
            elseif ( $model->data['type'] === 'mvc' ){
              $get($path.'mvc/'.$t['path'].$cur_path , $t['bcolor'], $t['url'], $type);
            }
          }
        }
      }
    }
  }
  if ( ksort($folders, SORT_STRING | SORT_FLAG_CASE) && ksort($files, SORT_STRING | SORT_FLAG_CASE) ){
    //return merge of file and folder create in function get
    $tot = array_merge(array_values($folders), array_values($files));
    return $tot;
  }
}
