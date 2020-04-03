<?php
/**
 * Created by BBN Solutions.
 * User: Vito Fava
 * Date: 11/12/17
 * Time: 16.09
 */

if ( $model->inc->ide ){
  //initially acquire all the repositories
  $repositories = $model->inc->ide->get_repositories();
  /*case initial return filter date of the repositories for dropdown list and unleashes the call to the tree at the
  first level */
  if ( !isset($model->data['repository']) && empty($model->data['path']) ){
    $arr = [];
    $themesCode =[
      '3024-day',
      '3024-night',
      'abcdef',
      'ambiance',
      'base16-dark',
      'base16-light',
      'bespin',
      'blackboard',
      'cobalt',
      'colorforth',
      'dracula',
      'duotone-dark',
      'duotone-light',
      'eclipse',
      'elegant',
      'erlang-dark',
      'hopscotch',
      'icecoder',
      'isotope',
      'lesser-dark',
      'liquibyte',
      'material',
      'mbo',
      'mdn-like',
      'midnight',
      'monokai',
      'neat',
      'neo',
      'night',
      'panda-syntax',
      'paraiso-dark',
      'paraiso-light',
      'pastel-on-dark',
      'railscasts',
      'rubyblue',
      'seti',
      'solarized dark',
      'solarized light',
      'the-matrix',
      'tomorrow-night-bright',
      'tomorrow-night-eighties',
      'ttcn',
      'twilight',
      'vibrant-ink',
      'xq-dark',
      'xq-light',
      'yeti',
      'zenburn'];

    foreach($repositories as $i => $val ){
      array_push($arr, [
        'text' => $val['text'],
        'repository'=> $i,
      ]);
    }
    return [
      'root' => APPUI_IDE_ROOT,
      'repositories' => $arr,
      'typesTheme' => $themesCode
    ];
  }//case in which we call through the tree and return the date treated
  else{
    //case first level
    if ( isset($model->data['repository']) ){
      $rep = $repositories[$model->data['repository']];
      $i = strpos($rep['path'], '/src');
      if( !empty($i) && (strpos($rep['path'], 'bbn/bbn/src') === false) ){
        $newPath = constant($rep['bbn_path']).substr($rep['path'],0, $i);
      }
      else{
        $newPath = constant($rep['bbn_path']).$rep['path'];
      }

    }//case from the second level onwards
    elseif ( isset($model->data['path']) ){
      $path= explode('/', $model->data['path']);
      $const= $path[0];
      $path[0]= constant($const);
      $newPath = implode('/', $path);
    }

    $newPath = str_replace('//','/',$newPath);

    $all = $model->inc->fs->get_files($newPath, true);

    $arr = [];


    $get_ext = function($filename) {
      $file = explode(".", basename($filename));
      $ext = $file[count($file)-1];
      return $ext;
    };

    //first we insert the folders
    foreach ( $all as $i => $ele ){
      if ( $model->inc->fs->is_dir($ele) ){
        $el = [
          'folder' => $model->inc->fs->is_dir($ele),
          'file' => $model->inc->fs->is_file($ele),
          'path' => isset($model->data['repository']) ? str_replace(constant($rep['bbn_path']), $rep['bbn_path'] . '/', $ele) : str_replace(constant($const), $const . '/', $ele),
          'text' => basename($ele),
          'icon' => 'zmdi zmdi-folder-outline',
          'num' =>  count($model->inc->fs->get_files($ele, true))
        ];
        /*$num_files = count($model->inc->fs->get_files($ele, true));
        if ( $num_files > 0 ){
          $el['num'] = $nuum_files;
        };*/
        array_push($arr, $el);
      }
    }
    // after we insert all the files
    foreach($all as $i=>$ele){
      if ( $model->inc->fs->is_file($ele) ){
        $el = [
          'folder' => $model->inc->fs->is_dir($ele),
          'file' => $model->inc->fs->is_file($ele),
          'extension' => $get_ext($ele),
          'path' => isset($model->data['repository']) ? str_replace( constant($rep['bbn_path']), $rep['bbn_path'] .'/', $ele) : str_replace( constant($const), $const.'/', $ele),
          'text' => basename($ele),
          'icon' => 'nf nf-fa-file',
          'num' => 0
        ];
        array_push($arr, $el);
      }
    };
    return [
      'data' => $arr
    ];
  }
}
return [
  'success' => false
];