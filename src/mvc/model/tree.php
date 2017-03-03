<?php
/** @var $model \bbn\mvc\model */
if ( !empty($model->data['repository']) &&
  !empty($model->data['repository_cfg']) &&
  isset($model->data['routes'], $model->data['onlydirs'], $model->data['tab'])
){
  $rep_cfg = $model->data['repository_cfg'];
  $is_mvc = $model->data['is_mvc'];
  $onlydirs = $model->data['onlydirs'];
  // Set the current path
  $cur_path = !empty($model->data['path']) ? $model->data['path'] . '/' : '';
  // Get the repository's root path
  $path = $model->inc->ide->get_root_path($rep_cfg);
  // Get the repository
  $file_check = [
    'viewables' => [
      'html',
      'htm',
      'php',
      'php4',
      'jinja2',
      'php5',
      'sql',
      'mysql',
      'js',
      'py',
      'txt',
      'log',
      '',
      'css',
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
  $excluded = [
    'svn',
    'notes',
    'git'
  ];
  // List of folders
  $folders = [];
  // List of files
  $files = [];

  $get = function($real, $color, $tab = 'code') use(&$folders, &$files, $onlydirs, $cur_path, $file_check, $excluded){
    if ( !empty($real) && file_exists($real) ){
      $todo = !empty($onlydirs) ? \bbn\file\dir::get_dirs($real) : \bbn\file\dir::get_files($real, true);
      foreach ( $todo as $t ){
        $is_file = is_file($t);
        $name = basename($t);
        if ( $is_file ){
          // File extension
          $ext = \bbn\str::file_ext($t);
          $name = \bbn\str::file_ext($t, 1)[0];
          if ( in_array($ext, $excluded) ){
            break;
          }
        }
        $cfg = [
          'title' => $name,
          'name' => $name,
          'path' => $cur_path . $name,
          'has_index' => empty($is_file) && \bbn\file\dir::has_file($t, 'index.php', 'index.html', 'index.htm'),
          //'parenthood' => true,
          'is_svg' => $is_file && ($ext === 'svg'),
          'is_viewable' => $is_file && in_array($ext, $file_check['viewables']) && ($ext !== 'svg'),
          'is_image' => $is_file && in_array($ext, $file_check['images']),
          //'default' => false,
          'dir' => $cur_path,
          'icon' => $is_file ? "$ext-icon" : "folder-icon",
          'bcolor' => $color,
          'folder' => empty($is_file),
          'lazy' => empty($is_file) && ( (empty($onlydirs) && !empty(\bbn\file\dir::get_files($t, true))) || (!empty($onlydirs) && !empty(\bbn\file\dir::get_dirs($t)))),
          'tab' => $tab
        ];
        if ( $is_file && !array_key_exists($name, $files) ){
          $files[$name] = $cfg;
        }
        else if ( empty($is_file) && !array_key_exists($name, $folders) ){
          $folders[$name] = $cfg;
        }
      }
    }
  };

  // Check if the repository is a mvc
  if ( !empty($is_mvc) ){
    // Get all files and all folders of each mvc's tabs (_ctrl tab excluded)
    foreach ( $rep_cfg['tabs'] as $i => $t ){
      if ( ($i !== '_ctrl') && !empty($t['path']) &&
        ( empty($model->data['tab']) || (!empty($model->data['tab']) && ($model->data['tab'] === $i)) )
      ){
        $get($path . $t['path'] . $cur_path, $t['bcolor'], $t['url']);
      }
    }
  }
  // Normal file
  else {
    $get($path . $cur_path, $rep_cfg['bcolor']);
  }
//die(var_dump($folders, $files, $path . $rep_cfg['path'] . $cur_path));
  if ( ksort($folders, SORT_STRING | SORT_FLAG_CASE) && ksort($files, SORT_STRING | SORT_FLAG_CASE) ){
    return array_merge(array_values($folders), array_values($files));
  }
}
