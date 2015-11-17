<?php
if ( isset($this->data['dir']) ){
  if ( !isset($this->data['path']) ){
    $this->data['path'] = '.';
  }
  if ( isset($this->data['path']) && (strpos($this->data['path'], '../') === false) ){

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
    /*
    if ( count($s['history']['dir']) < $max_history )
      $max_history = count($s['history']['dir']);
    if ( isset($this->post['d']) &&
    ( $this->post['d'] === 'next' ) &&
    ( $s['current']['dir'] > 0 ) &&
    isset($s['history']['dir'][$s['current']['dir']-1]) &&
    is_dir($s['history']['dir'][$s['current']['dir']-1]) )
    {
      $s['current']['dir']--;
      $s['dir'] = $s['history']['dir'][$s['current']['dir']];
    }
    else if ( isset($this->post['d']) &&
    ( $this->post['d'] === 'prev' ) &&
    ( $s['current']['dir'] <= $max_history ) &&
    isset($s['history']['dir'][$s['current']['dir']+1]) &&
    is_dir($s['history']['dir'][$s['current']['dir']+1]) )
    {
      $s['current']['dir']++;
      $s['dir'] = $s['history']['dir'][$s['current']['dir']];
    }
    else if ( isset($this->post['d']) && is_dir($this->post['d']) )
    {
      $s['current']['dir'] = 0;
      $s['dir'] = $this->post['d'];
    }
    else if ( !isset($s['dir']) || !is_dir($s['dir']) )
    {
      $s['current']['dir'] = 0;
      $s['dir'] = '.';
    }
    if ( substr($s['dir'],-1) !== '/' )
      $s['dir'] .= '/';
    if ( $s['current']['dir'] === 0 && ( !isset($s['history']['dir'][0]) || $s['history']['dir'][0] !== $s['dir'] ) )
    {
      array_unshift($s['history']['dir'],$s['dir']);
      array_splice($s['history']['dir'],50);
    }
    */

    $s =& $_SESSION[BBN_SESS_NAME];
    $old_path = getcwd();
    $excluded = array('.svn','_notes','.git', '_ctrl.php');
    $max_history = 50;

    chdir($this->data['dir']);

    $ofiles = \bbn\file\dir::get_files($this->data['path']);

    $dirs = array_map(function($a){
      $fs = \bbn\file\dir::get_files($a, 1);
      return [
        'path' => str_replace("./", "", $a),
        'name' => basename($a),
        'has_index' => \bbn\file\dir::has_file($a, 'index.php', 'index.html', 'index.htm') ? 1 : false,
        'parenthood' => true,
        'is_parent' => count($fs) > 0,
        'is_svg' => false,
        'is_viewable' => false,
        'is_image' => false,
        'default' => false,
        'icon' => "folder-icon",
        'type' => "dir"
      ];
    }, array_filter(\bbn\file\dir::get_dirs($this->data['path']), function($a) use($excluded){
      return !in_array(basename($a), $excluded);
    }));

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

    if ( empty($this->data['onlydir']) ){
      $files = array_map(function($a) use ($file_check, $ext_icons){
        $fs = \bbn\file\dir::get_files($a);
        $ext = \bbn\str\text::file_ext($a);
        $r = [
          'path' => $a,
          'name' => basename($a, ".php"),
          'has_index' => false,
          'is_parent' => false,
          'parenthood' => false,
          'is_svg' => ( $ext === 'svg' ),
          'is_viewable' => ( in_array($ext, $file_check['viewables']) && $ext !== 'svg' ) ? 1 : false,
          'is_image' => in_array($ext, $file_check['images']),
          'default' => false,
          'ext' => in_array($ext, $ext_icons) ? $ext : 'default',
          'type' => "file"
        ];
        $r['default'] = ( !$r['is_svg'] && !$r['is_viewable'] && !$r['is_image'] ) ? true : false;
        return $r;
      }, array_filter($ofiles, function($a) use($excluded){
        return !in_array(basename($a), $excluded);
      }));
    }

    $model = empty($this->data['onlydir']) ? array_merge($dirs, $files) : $dirs;
    chdir($old_path);
    return $model;
  }
}
