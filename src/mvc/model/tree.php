<?php
if ( isset($model->data['dir'], $model->data['routes']) ){
  // Initialize the directories object
  $current = (empty($model->data['path']) ? '' : $model->data['path']);
  if ( !empty($current) ){
    $current .= '/';
  }
  // Get the relative directory item
  if ( $dir = $model->inc->ide->dir($model->data['dir']) ){
    // Get the directory's root path
    $path = $model->inc->ide->get_root_path($model->data['dir']);
    //
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
    // Extensions for icons
    $ext_icons = [
      'css',
      'less',
      'html',
      'js',
      'py',
      'php',
      'sql',
      'svg',
      'json',
      'txt',
      'md'
    ];
    // List of folders
    $folders = [];
    // List of files
    $files = [];
    // Check if the directory is a mvc
    if ( !empty($dir['tabs']) ){
      // Get all files and all folders of each mvc's tabs (_ctrl tab excluded)
      foreach ( $dir['tabs'] as $i => $t ){
        if ( $i !== '_ctrl' ){
          // Set the real path
          $real = $path . $t['path'] . (empty($model->data['path']) ? '' : $model->data['path']);
          if ( file_exists($real) ){
            // Get files and folders
            $ff = \bbn\file\dir::get_files($real, 1);
            foreach ( $ff as $f ){
              if ( is_dir($f) ){
                // Folder name
                $fn = basename($f);
                // Check if the folder exists into folders array
                if ( !array_key_exists($fn, $folders) ){
                  // Add folder to array
                  $folders[$fn] = [
                    'path' => (empty($model->data['path']) ? '' : $model->data['path']. '/') . $fn,
                    //'value' => $model->data['dir'] . '/' . (empty($model->data['path']) ? '' : $model->data['path']. '/') . $fn,
                    'title' => $fn,
                    'has_index' => \bbn\file\dir::has_file($f, 'index.php', 'index.html', 'index.htm') ? 1 : false,
                    'parenthood' => true,
                    'is_svg' => false,
                    'is_viewable' => false,
                    'is_image' => false,
                    'default' => false,
                    'dir' => $current,
                    'icon' => "folder-icon",
                    'bcolor' => $t['bcolor'],
                    'folder' => true,
                    'lazy' => (bool)\bbn\file\dir::has_file($f)
                  ];
                  if ( empty($model->data['onlydir']) ){
                    $folders[$fn]['is_parent'] = count(\bbn\file\dir::get_files($f, 1)) > 0;
                  }
                  else {
                    $folders[$fn]['is_parent'] = count(\bbn\file\dir::get_dirs($f)) > 0;
                  }
                }
                else {
                  if ( ( empty($model->data['onlydir']) &&
                    (count(\bbn\file\dir::get_files($f, 1)) > 0) &&
                    !$folders[$fn]['is_parent'] ) ||
                    ( !empty($model->data['onlydir']) &&
                      (count(\bbn\file\dir::get_dirs($f)) > 0) &&
                      !$folders[$fn]['is_parent'] )
                  ){
                    $folders[$fn]['is_parent'] = 1;
                    $folders[$fn]['bcolor'] = $t['bcolor'];
                  }
                }
              }
              else if ( empty($model->data['onlydir']) &&
                !in_array(\bbn\str::file_ext($f), $excluded) &&
                (basename($f) !== '_ctrl.php')
              ){
                // File extension
                $ext = \bbn\str::file_ext($f);
                // Filename
                $fn = \bbn\str::file_ext($f, 1)[0];
                // Check if the file exists into files array
                if ( !array_key_exists($fn, $files) ){
                  $files[$fn] = [
                    'path' => (empty($model->data['path']) ? '' : $model->data['path']. '/') . basename($f),
                    'title' => $fn,
                    'name' => $fn,
                    'has_index' => false,
                    'is_parent' => false,
                    'parenthood' => false,
                    'is_svg' => ( $ext === 'svg' ),
                    'is_viewable' => ( in_array($ext, $file_check['viewables']) && ($ext !== 'svg')) ? true : false,
                    'is_image' => in_array($ext, $file_check['images']),
                    'default' => false,
                    'dir' => $current,
                    'ext' => in_array($ext, $ext_icons) ? $ext : 'default',
                    'icon' => "$ext-icon",
                    'bcolor' => $t['bcolor'],
                    'tab' => $t['url'],
                    'type' => 'file'
                  ];
                  $files[$fn]['default'] = ( !$files[$fn]['is_svg'] &&
                    !$files[$fn]['is_viewable'] &&
                    !$files[$fn]['is_image'] ) ? true : false;
                }
              }
            }
          }
        }
      }
    }
    else {
      // Get files and folders
      $path = $path . (empty($model->data['path']) ? '' : $model->data['path']);
      $ff = \bbn\file\dir::get_files($path, 1);
      foreach ( $ff as $f ){
        if ( is_dir($f) ){
          // Folder name
          $fn = basename($f);
          // Add folder to array
          $folders[$fn] = [
            'path' => (empty($model->data['path']) ? '' : $model->data['path']. '/') . $fn,
            //'value' => $model->data['dir'] . '/' . (empty($model->data['path']) ? '' : $model->data['path']. '/') . $fn,
            'title' => $fn,
            'has_index' => \bbn\file\dir::has_file($f, 'index.php', 'index.html', 'index.htm') ? 1 : false,
            'dir' => $current,
            'parenthood' => true,
            'is_svg' => false,
            'is_viewable' => false,
            'is_image' => false,
            'default' => false,
            'icon' => "folder-icon",
            'bcolor' => $dir['bcolor'],
            'folder' => true,
            'lazy' => (bool)\bbn\file\dir::has_file($f)
          ];
          if ( empty($model->data['onlydir']) ){
            $folders[$fn]['is_parent'] = count(\bbn\file\dir::get_files($f, 1)) > 0;
          }
          else {
            $folders[$fn]['is_parent'] = count(\bbn\file\dir::get_dirs($f)) > 0;
          }
        }
        else if ( empty($model->data['onlydir']) &&
          !in_array(\bbn\str::file_ext($f), $excluded)
        ){
          // File extension
          $ext = \bbn\str::file_ext($f);
          // Filename
          $fn = \bbn\str::file_ext($f, 1)[0];
          // Add file
          $files[$f] = [
            'path' => (empty($model->data['path']) ? '' : $model->data['path']. '/') . basename($f),
            'title' => $fn,
            'file' => $fn,
            'name' => $fn,
            'has_index' => false,
            'is_parent' => false,
            'parenthood' => false,
            'dir' => $current,
            'is_svg' => ( $ext === 'svg' ),
            'is_viewable' => ( in_array($ext, $file_check['viewables']) && ($ext !== 'svg')) ? true : false,
            'is_image' => in_array($ext, $file_check['images']),
            'default' => false,
            'ext' => in_array($ext, $ext_icons) ? $ext : 'default',
            'icon' => "$ext-icon",
            'bcolor' => $dir['bcolor'],
            'type' => "file"
          ];
          $files[$f]['default'] = ( !$files[$f]['is_svg'] &&
            !$files[$f]['is_viewable'] &&
            !$files[$f]['is_image'] ) ? true : false;

        }
      }

    }

    if ( ksort($folders, SORT_STRING | SORT_FLAG_CASE) && ksort($files, SORT_STRING | SORT_FLAG_CASE) ){
      return empty($model->data['onlydir']) ?
        array_merge(array_values($folders), array_values($files)) :
        array_values($folders);
    }
  }
}
