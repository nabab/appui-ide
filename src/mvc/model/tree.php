<?php
/** @var $model \bbn\mvc\model */
if ( !empty($model->data['repository']) &&
  !empty($model->data['repository_cfg']) &&
  isset($model->data['onlydirs'], $model->data['tab'])
){
  $rep_cfg = $model->data['repository_cfg'];
  $is_mvc = $model->data['is_mvc'];
  $onlydirs = $model->data['onlydirs'];
  // Set the current path
  $cur_path = !empty($model->data['path']) ? $model->data['path'] . '/' : '';
  // Get the repository's root path
  $path = $model->inc->ide->get_root_path($rep_cfg);

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
    'git',
    'bak'
  ];
  // List of folders
  $folders = [];
  // List of files
  $files = [];

  $get = function($real, $color, $tab = false) use(&$folders, &$files, $onlydirs, $cur_path, $file_check, $excluded){

    if ( !empty($real) && file_exists($real) ){
      $todo = !empty($onlydirs) ? \bbn\file\dir::get_dirs($real) : \bbn\file\dir::get_files($real, true);
      foreach ( $todo as $t ){
        $name = basename($t);
        if ( $name !== '_ctrl.php' ){
          $is_file = is_file($t);
          if ( !empty($is_file) ){
            // File extension
            $ext = \bbn\str::file_ext($t);
            $name = \bbn\str::file_ext($t, 1)[0];
          }
          if (
            ($is_file && !isset($files[$name]) && !\in_array($ext, $excluded)) ||
            (!$is_file && !isset($folders[$name]))
          ){
            $num = 0;
            if ( empty($is_file) ){
              if ( (empty($onlydirs) && ($tf = \bbn\file\dir::get_files($t, true))) ||
                (!empty($onlydirs) && ($tf = \bbn\file\dir::get_dirs($t)))
              ){
                $num = \count($tf);
              }
            }
            $cfg = [
              'text' => $name,
              'name' => $name,
              'path' => $cur_path . $name,
              'has_index' => empty($is_file) && \bbn\file\dir::has_file($t, 'index.php', 'index.html', 'index.htm'),
              //'parenthood' => true,
              'is_svg' => !empty($is_file) && ($ext === 'svg'),
              'is_viewable' => !empty($is_file) && \in_array($ext, $file_check['viewables']) && ($ext !== 'svg'),
              'is_image' => !empty($is_file) && \in_array($ext, $file_check['images']),
              //'default' => false,
              'dir' => $cur_path,
              'icon' => !empty($is_file) ? "$ext-icon" : "folder-icon",
              'bcolor' => $color,
              'folder' => empty($is_file),
              'lazy' => empty($is_file) && ( (empty($onlydirs) && !empty(\bbn\file\dir::get_files($t, true))) || (!empty($onlydirs) && !empty(\bbn\file\dir::get_dirs($t)))),
              'num' => $num,
              'tab' => $tab,
              'ext' => !empty($is_file) ? $ext : false,
            ];
            if ( $is_file ){
              $files[$name] = $cfg;
            }
            else {
              $folders[$name] = $cfg;
            }
          }
          else if ( !$is_file && isset($folders[$name]) && !$folders[$name]['num'] ){
            $tf = \bbn\file\dir::get_files($t, true);
            if ( $num = \count($tf) ){
              $folders[$name]['num'] = $num;
            }
          }
        }
      }
    }
  };

  // Check if the repository is a mvc
  if ( !empty($is_mvc) ){
    // Get all files and all folders of each mvc's tabs (_ctrl tab excluded)
    foreach ( $rep_cfg['tabs'] as $i => $t ){
      if ( ($i !== '_ctrl') &&
        !empty($t['path']) &&
        ( empty($model->data['tab']) ||
          ( !empty($model->data['tab']) &&
            ($model->data['tab'] === $i)
          )
        )
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
