<?php

$arr = [
  'ide' => [],
  'elements' => []
];

if ($model->hasData('path')) {
  $path = $model->data['path'];
  $git = new bbn\Api\Git($path);
  try {
    $difference_git = $git->diff();
  }
  catch (\Exception $e) {
    $difference_git = false;
  }

  if ( !empty($difference_git) ){
    $arr['elements'] = array_map(function($a) use($path){
      return [
        'ele' => $path.'/'.(!empty($i = strpos($a['file'], ' -> ')) ? substr($a['file'], $i+4)  : $a['file']),
        'state' => $a['action']
      ];
    }, $difference_git);

    $branches = [
      'components' => ['.php','.js','.html', '.less', '.css'],
      'mvc' => [
        'public' => ['.php'],
        'private' => ['.php'],
        'model' => ['.php'],
        'js' => ['.js'],
        'html' => ['.php', '.html'],
        'css' => ['.css', '.less']
      ]
    ];

    foreach ( $arr['elements'] as $val ){
      $relative = str_replace($path.'/src/',"",$val['ele']);
      $part = explode('/', $relative);
      $root = array_shift($part);
      if ( $root === 'components' ){
        if ( $model->inc->fs->isFile($val['ele']) ){
          $part = explode('.', $relative);
          $relative = array_shift($part);
        }
        foreach( $branches['components'] as $ext ){
          $info = [
            'ele' => $path.'/src/'.$relative.$ext,
            'state' => $val['state']
          ];
          if ( array_search($info, $arr['ide']) === false ){
            $arr['ide'][] = $info;
          }
        }
      }
      elseif( $root === 'mvc' ){
        $relative = explode("/", $relative);
        array_shift($relative);
        array_shift($relative);
        $relative_origin = implode('/', $relative);
        foreach ( $branches['mvc'] as $folder => $exts ){
          $element = $path.'/src/'. $root. '/'.$folder.'/';
          if ( $model->inc->fs->isFile($val['ele']) ){
            $part = explode('.', $relative_origin);
            $relative = array_shift($part);
            foreach ( $exts as $ext ){
              $element = $path.'/src/'. $root. '/'.$folder.'/'.$relative;
              $element .= $ext;
              $info = [
                'ele' => $element,
                'state' => $val['state']
              ];
              if ( array_search($info, $arr['ide']) === false ){
                $arr['ide'][] = $info;
              }
            }
          }
          else{
            $info = [
              'ele' => $element.$relative_origin,
              'state' => $val['state']
            ];
            if ( array_search($info, $arr['ide']) === false ){
              $arr['ide'][] = $info;
            }
          }
        }
      }
      else{
        if ( array_search($val, $arr['ide']) === false ){
          $arr['ide'][] = $val;
        }
      }
    }
  }
}

return $arr;
